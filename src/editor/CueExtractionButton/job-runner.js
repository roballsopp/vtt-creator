import EventEmitter from 'events'
import {gql} from '@apollo/client'
import ExtendableError from '../../errors/ExtendableError'
import {SpeechToTextJobTimeout} from '../../config'
import {getAudioBlobFromVideo} from '../../services/av.service'

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
export const EVENT_CANCEL_DISABLED = 'cancel-disabled'
export const EVENT_JOB_STATE = 'job-state-change'
export const EVENT_ERROR = 'error'
export const EVENT_DONE = 'done'

export const JOB_STATE_EXTRACTING = 'extracting-audio'
export const JOB_STATE_UPLOADING = 'uploading-audio'
export const JOB_STATE_TRANSCRIBING = 'transcribing-audio'
export const JOB_STATE_FAILED = 'job-failed'
export const JOB_STATE_CANCELLING = 'job-cancelling'
export const JOB_STATE_CANCELLED = 'job-cancelled'
export const JOB_STATE_COMPLETED = 'job-completed'

export function getJobRunner(apolloClient, uploadFile) {
	async function getUploadUrl() {
		const {
			data: {uploadUrl},
		} = await apolloClient.query({
			fetchPolicy: 'network-only',
			query: gql`
				query getUploadUrl {
					uploadUrl {
						filename
						url
					}
				}
			`,
		})

		return uploadUrl
	}

	async function initTranscription(filename, languageCode) {
		const {
			data: {beginTranscription},
		} = await apolloClient.mutate({
			mutation: gql`
				mutation initTranscription($filename: String!, $languageCode: String!) {
					beginTranscription(filename: $filename, languageCode: $languageCode) {
						job {
							id
							user {
								id
							}
							state
						}
					}
				}
			`,
			variables: {filename, languageCode},
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
							}
						}
					`,
					variables: {jobId},
				})
				.then(({data: {transcriptionJob}}) => {
					if (cancelled) {
						return transcriptionJob
					}

					if (timedOut) {
						throw new Error('Poll timeout exceeded.')
					}

					if (transcriptionJob.state !== 'pending') {
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
						}
					}
				}
			`,
			variables: {jobId},
		})
		return cancelTranscription
	}

	return new TaskQueue([
		{
			name: 'Extract Audio',
			run: (ctx, queue) => {
				queue.emit(EVENT_JOB_STATE, JOB_STATE_EXTRACTING)

				return {
					promise: getAudioBlobFromVideo(ctx.videoFile)
						.then(audioBlob => ({...ctx, audioBlob}))
						.catch(e => {
							throw new ExtractionError(e.message)
						}),
				}
			},
		},
		{
			name: 'Get Upload Url',
			run: (ctx, queue) => {
				queue.emit(EVENT_JOB_STATE, JOB_STATE_UPLOADING)

				return {
					promise: getUploadUrl()
						.then(({filename, url}) => ({...ctx, filename, uploadUrl: url}))
						.catch(e => {
							throw new UploadUrlError(e.message)
						}),
				}
			},
		},
		{
			name: 'Upload Audio',
			run: (ctx, queue) => {
				const handleProgress = e => {
					queue.emit(EVENT_UPLOAD_PROGRESS, e.loaded, e.total)
				}
				return {
					promise: uploadFile(ctx.audioBlob, ctx.uploadUrl, handleProgress)
						.then(() => ctx)
						.catch(e => {
							throw new UploadError(e.message)
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
					promise: initTranscription(ctx.filename, ctx.languageCode)
						.then(({job}) => {
							recordS2TEvent(ctx.duration)
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

class TaskQueue extends EventEmitter {
	constructor(queue = []) {
		super()
		this._queue = queue
		this._currentTask = null
		this._cancelled = false
		this.inProgress = false
		this.cancelDisabled = false
	}

	async run(startCtx = {}) {
		this.inProgress = true

		try {
			let prevTaskPromise = Promise.resolve(startCtx)

			for (let i = 0; i < this._queue.length; i++) {
				const currentTask = this._queue[i]
				// wait for the previous task to finish
				const runContext = await prevTaskPromise
				// if we cancelled some time during the previous task, don't continue
				if (this._cancelled) {
					this.inProgress = false
					return
				}
				// start the current task, passing the context from the previous task
				this._currentTask = currentTask.run(runContext, this)
				prevTaskPromise = this._currentTask.promise
			}

			const result = await prevTaskPromise

			this.inProgress = false

			// we could still have cancelled during the last task, and we need to not send a completion event if so
			if (this._cancelled) return

			this.emit(EVENT_JOB_STATE, JOB_STATE_COMPLETED)
			this.emit(EVENT_DONE, result)
		} catch (e) {
			this.inProgress = false
			this.emit(EVENT_JOB_STATE, JOB_STATE_FAILED)
			this.emit(EVENT_ERROR, e)
		}
	}

	disableCancel() {
		this.cancelDisabled = true
		this.emit(EVENT_CANCEL_DISABLED, true)
	}

	enableCancel() {
		this.cancelDisabled = false
		this.emit(EVENT_CANCEL_DISABLED, false)
	}

	async cancel() {
		if (!this.cancelDisabled) {
			this._cancelled = true
			this.emit(EVENT_JOB_STATE, JOB_STATE_CANCELLING)
			if (this._currentTask?.cancel) await this._currentTask.cancel()
			await this._currentTask.promise
			this.emit(EVENT_JOB_STATE, JOB_STATE_CANCELLED)
		}
	}
}

function recordS2TEvent(videoDuration) {
	const minutes = Math.round((videoDuration || 0) / 60) + ''
	window.gtag('event', `video_length_${minutes.padStart(2, '0')}`, {
		event_category: 'speech_to_text',
		value: videoDuration,
	})
}
