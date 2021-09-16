import {gql} from '@apollo/client'
import TaskQueue, {
	QUEUE_EVENT_CANCEL_DISABLED,
	QUEUE_EVENT_QUEUE_STATE,
	QUEUE_EVENT_ERROR,
	QUEUE_EVENT_DONE,
	QUEUE_EVENT_CANCELLING,
	QUEUE_EVENT_CANCELLED,
} from '../../common/TaskQueue'
import {ExtendableError} from '../../errors'
import {SpeechToTextJobTimeout} from '../../config'
import {appendNewJob, JobHistoryTable_jobsFragment} from '../../account/JobHistoryTable.graphql'
import {AccountPage_userFragment} from '../../account/AccountPage.graphql'
import {UserContext_userFragment} from '../../common/UserContext/UserContext.graphql'

export class ExtractionError extends ExtendableError {
	constructor(m = 'Failed to extract audio') {
		super(m)
		this.name = 'ExtractionError'
	}
}

export class UploadUrlError extends ExtendableError {
	constructor(m = 'Failed to get upload url') {
		super(m)
		this.name = 'UploadUrlError'
	}
}

export class UploadError extends ExtendableError {
	constructor(m = 'Failed to upload audio') {
		super(m)
		this.name = 'UploadError'
	}
}

export class JobStartError extends ExtendableError {
	constructor(m = 'Failed to start transcription job') {
		super(m)
		this.name = 'JobStartError'
	}
}

export class JobError extends ExtendableError {
	constructor(m = 'Failed to transcribe audio') {
		super(m)
		this.name = 'JobError'
	}
}

export const EVENT_UPLOAD_PROGRESS = 'uploading-progress'
export const EVENT_CANCEL_DISABLED = QUEUE_EVENT_CANCEL_DISABLED
export const EVENT_JOB_STATE = QUEUE_EVENT_QUEUE_STATE
export const EVENT_ERROR = QUEUE_EVENT_ERROR
export const EVENT_DONE = QUEUE_EVENT_DONE
export const EVENT_CANCELLING = QUEUE_EVENT_CANCELLING
export const EVENT_CANCELLED = QUEUE_EVENT_CANCELLED

export const JOB_STATE_EXTRACTING = 'extracting-audio'
export const JOB_STATE_UPLOADING = 'uploading-audio'
export const JOB_STATE_TRANSCRIBING = 'transcribing-audio'

export function getJobRunner(apolloClient, uploadFile) {
	async function getUploadUrl(filename) {
		const {
			data: {createFileUpload},
		} = await apolloClient.mutate({
			mutation: gql`
				mutation getUploadUrl($filename: String!) {
					createFileUpload(filename: $filename) {
						fileUploadId
						uploadUrl
					}
				}
			`,
			variables: {filename},
		})

		return createFileUpload
	}

	async function extractAudio(inputFileId) {
		const {
			data: {extractAudioFromFile},
		} = await apolloClient.mutate({
			mutation: gql`
				mutation extractAudio($inputFileId: String!) {
					extractAudioFromFile(inputFileId: $inputFileId) {
						audioFile {
							id
						}
					}
				}
			`,
			variables: {inputFileId},
		})

		return extractAudioFromFile.audioFile
	}

	async function initTranscription(inputFileId, languageCode, speechModel) {
		const {
			data: {beginTranscription},
		} = await apolloClient.mutate({
			mutation: gql`
				mutation initTranscription($inputFileId: String!, $languageCode: String!, $speechModel: SpeechModelEnum!) {
					beginTranscription(inputFileId: $inputFileId, languageCode: $languageCode, speechModel: $speechModel) {
						job {
							id
							state
							...JobHistoryTable_jobs
						}
					}
				}
				${JobHistoryTable_jobsFragment}
			`,
			variables: {inputFileId, languageCode, speechModel},
			update(cache, {data: {beginTranscription}}) {
				appendNewJob(cache, beginTranscription?.job)
			},
		})
		return beginTranscription
	}

	function pollTranscriptionJob(jobId, interval = 1000, timeout = SpeechToTextJobTimeout) {
		let cancelled = false
		let timedOut = false

		const checkJob = jobId => {
			return apolloClient
				.query({
					fetchPolicy: 'network-only',
					query: gql`
						query getTranscriptionJob($jobId: String!) {
							self {
								# the user fragments are spread here to update the user's credit after a job completes
								...AccountPage_user
								...UserContext_user
							}
							transcriptionJob(jobId: $jobId) {
								id
								state
								transcript {
									words {
										startTime
										endTime
										word
									}
								}
								...JobHistoryTable_jobs
							}
						}
						${JobHistoryTable_jobsFragment}
						${UserContext_userFragment}
						${AccountPage_userFragment}
					`,
					variables: {jobId},
				})
				.then(({data: {transcriptionJob}}) => {
					if (timedOut) {
						throw new Error('Poll timeout exceeded.')
					}

					if (transcriptionJob.state === 'error') {
						throw new Error('job failed during polling')
					}

					if (['cancelled', 'success'].includes(transcriptionJob.state)) {
						return transcriptionJob
					}

					if (cancelled) {
						return transcriptionJob
					}

					return new Promise((resolve, reject) => {
						setTimeout(() => {
							checkJob(jobId)
								.then(resolve)
								.catch(reject)
						}, interval)
					})
				})
		}

		const timeoutId = setTimeout(() => {
			timedOut = true
		}, timeout)

		const promise = checkJob(jobId)

		return {
			promise: promise
				.then(j => j.transcript)
				.catch(err => {
					if (err.networkError) {
						if (err.networkError.result) {
							throw new Error(err.networkError.result.errors[0].message)
						}
						throw err.networkError
					}
					throw new Error(err)
				})
				.finally(() => {
					clearTimeout(timeoutId)
				}),
			cancel: () => {
				cancelled = true
				return promise
			},
		}
	}

	async function cancelTranscription(jobId) {
		const {
			data: {cancelTranscription},
		} = await apolloClient.mutate({
			mutation: gql`
				mutation cancelTranscription($jobId: String!) {
					cancelTranscription(jobId: $jobId) {
						job {
							id
							state
							...JobHistoryTable_jobs
						}
					}
				}
				${JobHistoryTable_jobsFragment}
			`,
			variables: {jobId},
		})
		return cancelTranscription
	}

	return new TaskQueue([
		{
			name: 'Get Upload Url',
			run: (ctx, queue) => {
				queue.emit(EVENT_JOB_STATE, JOB_STATE_UPLOADING)

				return {
					promise: getUploadUrl(ctx.videoFile.name)
						.then(({fileUploadId, uploadUrl}) => ({...ctx, videoFileId: fileUploadId, uploadUrl}))
						.catch(e => {
							throw new UploadUrlError(e.message)
						}),
				}
			},
		},
		{
			name: 'Upload Video',
			run: (ctx, queue) => {
				const handleProgress = e => {
					queue.emit(EVENT_UPLOAD_PROGRESS, e.loaded, e.total)
				}
				const uploader = uploadFile(ctx.videoFile, ctx.uploadUrl, handleProgress)
				return {
					promise: uploader.promise
						.then(() => ctx)
						.catch(e => {
							throw new UploadError(e.message)
						}),
					cancel: () => uploader.cancel(),
				}
			},
		},
		{
			name: 'Extract Audio',
			run: (ctx, queue) => {
				queue.emit(EVENT_JOB_STATE, JOB_STATE_EXTRACTING)

				return {
					promise: extractAudio(ctx.videoFileId)
						.then(audioFile => ({...ctx, audioFileId: audioFile.id}))
						.catch(e => {
							throw new ExtractionError(e.message)
						}),
				}
			},
		},
		{
			name: 'Begin Transcription',
			run: (ctx, queue) => {
				queue.emit(EVENT_JOB_STATE, JOB_STATE_TRANSCRIBING)
				queue.disableCancel()
				return {
					promise: initTranscription(ctx.audioFileId, ctx.languageCode, ctx.speechModel)
						.then(({job}) => {
							return {...ctx, job: job}
						})
						.catch(e => {
							throw new JobStartError(e.message)
						})
						.finally(() => queue.enableCancel()),
				}
			},
		},
		{
			name: 'Poll Transcription',
			run: ctx => {
				const poller = pollTranscriptionJob(ctx.job.id, ctx.pollInterval)
				return {
					promise: poller.promise
						.then(transcript => ({...ctx, transcript}))
						.catch(e => {
							throw new JobError(e.message)
						}),
					cancel: () => {
						return Promise.all([poller.cancel(), cancelTranscription(ctx.job.id)])
					},
				}
			},
		},
	])
}
