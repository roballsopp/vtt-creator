import * as React from 'react'
import * as PropTypes from 'prop-types'
import {Box, Dialog, DialogActions, DialogContent, DialogTitle, Typography} from '@material-ui/core'
import {styled} from '@material-ui/styles'
import UploadProgress, {
	UPLOAD_STATE_COMPLETED,
	UPLOAD_STATE_EXTRACTING,
	UPLOAD_STATE_PROCESSING,
	UPLOAD_STATE_UPLOADING,
	UPLOAD_STATE_FAILED,
} from './upload-progress.component'
import LanguageSelector from './LanguageSelector'
import {handleError} from '../../services/error-handler.service'
import {uploadFile} from '../../services/rest-api.service'
import {useToast, Button, useVideoFile} from '../../common'
import {useDuration} from '../../common/video'
import {
	EVENT_CANCEL_DISABLED,
	EVENT_DONE,
	EVENT_ERROR,
	EVENT_JOB_STATE,
	EVENT_UPLOAD_PROGRESS,
	ExtractionError,
	getJobRunner,
	JOB_STATE_CANCELLING,
	JOB_STATE_EXTRACTING,
	JOB_STATE_FAILED,
	JOB_STATE_TRANSCRIBING,
	JOB_STATE_UPLOADING,
	JobError,
	JobStartError,
	UploadError,
	UploadUrlError,
} from './job-runner'
import {useApolloClient} from '@apollo/client'

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
})

CueExtractionDialog.propTypes = {
	transcriptionCost: PropTypes.number.isRequired,
	open: PropTypes.bool,
	onRequestClose: PropTypes.func.isRequired,
	onExtractComplete: PropTypes.func.isRequired,
}

export default function CueExtractionDialog({transcriptionCost, open, onRequestClose, onExtractComplete}) {
	const {videoFile} = useVideoFile()
	const {duration} = useDuration()
	const apolloClient = useApolloClient()
	// there is a brief moment during the call to initTranscription when closing the modal allows a transcription
	//   to continue. cancelDisabled is true during that time so we can prevent this state
	const [cancelDisabled, setCancelDisabled] = React.useState(false)
	const [cancelling, setCancelling] = React.useState(false)
	const [progressBytes, setProgressBytes] = React.useState(0)
	const [totalBytes, setTotalBytes] = React.useState(0)
	const [uploadState, setUploadState] = React.useState()
	const [languageCode, setLanguageCode] = React.useState('en-US')
	const jobRunnerRef = React.useRef(null)

	const toast = useToast()

	const handleRequestClose = React.useCallback(
		(e, reason) => {
			if (['backdropClick', 'escapeKeyDown'].includes(reason)) {
				return
			}

			if (!jobRunnerRef.current?.inProgress) {
				return onRequestClose(e)
			}

			jobRunnerRef.current
				.cancel()
				.then(() => {
					onRequestClose(e)
				})
				.catch(handleError)
		},
		[onRequestClose]
	)

	React.useEffect(() => {
		return () => {
			if (jobRunnerRef.current?.inProgress) {
				jobRunnerRef.current.cancel().catch(handleError)
			}
		}
	}, [])

	const extractCuesFromVideo = async () => {
		const runner = getJobRunner(apolloClient, uploadFile)
		jobRunnerRef.current = runner

		function handleJobStateUpdate(state) {
			switch (state) {
				case JOB_STATE_EXTRACTING:
					return setUploadState(UPLOAD_STATE_EXTRACTING)
				case JOB_STATE_UPLOADING:
					return setUploadState(UPLOAD_STATE_UPLOADING)
				case JOB_STATE_TRANSCRIBING:
					return setUploadState(UPLOAD_STATE_PROCESSING)
				case JOB_STATE_CANCELLING:
					return setCancelling(true)
				case JOB_STATE_FAILED:
					setCancelling(false)
					return setUploadState(UPLOAD_STATE_FAILED)
				default:
					setCancelling(false)
					return setUploadState(UPLOAD_STATE_COMPLETED)
			}
		}

		function handleJobError(e) {
			handleError(e, {file: {name: videoFile?.name, size: videoFile?.size, type: videoFile?.type}})
			if (e instanceof ExtractionError) {
				if (e.message === 'Not enough arguments') {
					return toast.error(
						'Your version of Safari is out of date and cannot extract audio from this video. Upgrade to 14.1 or later to use this feature, or try a different browser.'
					)
				}
				return toast.error('Your browser cannot extract audio from this video. Try a different video file or browser.')
			}
			if (e instanceof UploadUrlError) {
				return toast.error('Unable to start upload. Please try again.')
			}
			if (e instanceof UploadError) {
				return toast.error('Upload failed. Please try again.')
			}
			if (e instanceof JobStartError) {
				return toast.error('Unable to start transcription. Please try again.')
			}
			if (e instanceof JobError) {
				return toast.error('Transcription failed. Please try again.')
			}
		}

		function handleUploadProgress(loaded, total) {
			setProgressBytes(loaded)
			setTotalBytes(total)
		}

		function handleJobDone({transcript}) {
			if (!transcript) {
				toast.error('The transcription completed, but no speech in the chosen language was found')
				return handleError(new Error('unable to find any transcribable speech'))
			}

			onExtractComplete(transcript)
			toast.success('Extraction successful!')
			onRequestClose()
		}

		runner.on(EVENT_JOB_STATE, handleJobStateUpdate)
		runner.on(EVENT_ERROR, handleJobError)
		runner.on(EVENT_UPLOAD_PROGRESS, handleUploadProgress)
		runner.on(EVENT_CANCEL_DISABLED, setCancelDisabled)
		runner.once(EVENT_DONE, handleJobDone)

		try {
			await runner.run({
				videoFile,
				duration,
				languageCode,
				pollInterval: 2000,
			})
		} finally {
			runner.removeAllListeners()
		}
	}

	return (
		<Dialog maxWidth="sm" fullWidth open={open} onClose={handleRequestClose} aria-labelledby="extract-dialog-title">
			<Title id="extract-dialog-title" disableTypography>
				<Typography variant="h6">Extract captions from video</Typography>
			</Title>
			<DialogContent>
				<Box pb={2}>
					<Typography>
						This action will extract the audio from your video and attempt to find speech in the language you choose
						below. If any speech is found, captions will be automatically generated for you.
					</Typography>
					<LanguageSelector
						value={languageCode}
						disabled={jobRunnerRef.current?.inProgress}
						onChange={setLanguageCode}
					/>
				</Box>
				<Box pb={4}>
					<Typography gutterBottom>Transcription cost: (${transcriptionCost.toFixed(2)})</Typography>
					<Typography variant="caption">
						The cost of this transcription will be deducted from your credit balance immediately, but will be refunded
						if you click &ldquo;Cancel&rdquo; below. It can take up to 20 minutes to complete the transcription process
						for an hour long video. Please be patient and do not close this dialog until your transcription completes.
					</Typography>
				</Box>
				{jobRunnerRef.current?.inProgress && (
					<UploadProgress progressBytes={progressBytes} totalBytes={totalBytes} uploadState={uploadState} />
				)}
			</DialogContent>
			<DialogActions>
				<Button
					name="Extract Cues Cancel"
					loading={cancelling}
					onClick={handleRequestClose}
					color="primary"
					disabled={cancelDisabled}>
					Cancel
				</Button>
				<Button
					name="Extract Cues Confirm"
					onClick={extractCuesFromVideo}
					color="primary"
					variant="contained"
					disabled={jobRunnerRef.current?.inProgress}>
					Extract cues
				</Button>
			</DialogActions>
		</Dialog>
	)
}
