import * as React from 'react'
import * as PropTypes from 'prop-types'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import {styled, makeStyles} from '@material-ui/styles'
import {GetTotalCost} from '../../config'
import UploadProgress, {
	UPLOAD_STATE_COMPLETED,
	UPLOAD_STATE_EXTRACTING,
	UPLOAD_STATE_PROCESSING,
	UPLOAD_STATE_UPLOADING,
	UPLOAD_STATE_FAILED,
} from './upload-progress.component'
import LanguageSelector from './LanguageSelector'
import useApiHelper from './useApiHelper'
import {getAudioBlobFromVideo} from '../../services/av.service'
import {handleError} from '../../services/error-handler.service'
import {uploadFile} from '../../services/rest-api.service'
import {useToast, Button, useVideoFile} from '../../common'
import {useDuration} from '../../common/video'

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
})

const useStyles = makeStyles(theme => ({
	priceInfo: {
		paddingBottom: theme.spacing(4),
	},
}))

CueExtractionDialog.propTypes = {
	open: PropTypes.bool,
	onRequestClose: PropTypes.func.isRequired,
	onExtractComplete: PropTypes.func.isRequired,
}

export default function CueExtractionDialog({open, onRequestClose, onExtractComplete}) {
	const {videoFile} = useVideoFile()
	const {duration} = useDuration()
	const cost = GetTotalCost(duration)
	const classes = useStyles()
	const [extracting, setExtracting] = React.useState(false)
	// there is a brief moment during the call to initTranscription when closing the modal allows a transcription
	//   to continue. cancelDisabled is true during that time so we can prevent this state
	const [cancelDisabled, setCancelDisabled] = React.useState(false)
	const [progressBytes, setProgressBytes] = React.useState(0)
	const [totalBytes, setTotalBytes] = React.useState(0)
	const [uploadState, setUploadState] = React.useState()
	const [languageCode, setLanguageCode] = React.useState('en-US')
	const jobIdRef = React.useRef('')
	const transcriptionPollRef = React.useRef(null)

	const toast = useToast()
	const {getUploadUrl, initTranscription, pollTranscriptionJob, cancelTranscription} = useApiHelper()

	const handleRequestClose = (e, reason) => {
		if (['backdropClick', 'escapeKeyDown'].includes(reason)) {
			return
		}

		if (uploadState === UPLOAD_STATE_PROCESSING && jobIdRef.current) {
			transcriptionPollRef.current.cancel()
			cancelTranscription(jobIdRef.current)
				.then(() => {
					jobIdRef.current = ''
				})
				.catch(handleError)
		}
		transcriptionPollRef.current = null
		onRequestClose(e)
	}

	const extractCuesFromVideo = async e => {
		setExtracting(true)
		setCancelDisabled(false)
		try {
			setUploadState(UPLOAD_STATE_EXTRACTING)
			let audioBlob
			try {
				audioBlob = await getAudioBlobFromVideo(videoFile)
			} catch (e) {
				toast.error('Unable to read audio from video file.')
				throw e
			}

			setUploadState(UPLOAD_STATE_UPLOADING)
			let filename, url
			try {
				;({filename, url} = await getUploadUrl())
			} catch (e) {
				toast.error('Unable to start upload. Please try again.')
				throw e
			}

			try {
				await uploadFile(audioBlob, url, e => {
					setProgressBytes(e.loaded)
					setTotalBytes(e.total)
				})
			} catch (e) {
				toast.error('Upload failed. Please try again.')
				throw e
			}

			setUploadState(UPLOAD_STATE_PROCESSING)
			setCancelDisabled(true)
			try {
				const {job} = await initTranscription(filename, languageCode)
				jobIdRef.current = job.id
				setCancelDisabled(false)
				recordS2TEvent(duration)
			} catch (e) {
				toast.error('Unable to start transcription. Please try again.')
				throw e
			}

			let transcript
			try {
				transcriptionPollRef.current = pollTranscriptionJob(jobIdRef.current, 2000)
				transcript = await transcriptionPollRef.current.promise
			} catch (e) {
				toast.error('Transcription failed. Please try again.')
				throw e
			}

			setUploadState(UPLOAD_STATE_COMPLETED)

			if (!transcript) {
				toast.error('Unable to find any transcribable speech.')
				throw new Error('Unable to find any transcribable speech.')
			}

			onExtractComplete(transcript)
			toast.success('Extraction successful!')
			onRequestClose(e)
		} catch (err) {
			setUploadState(UPLOAD_STATE_FAILED)
			setCancelDisabled(false)
			handleError(err)
		}

		setExtracting(false)
	}

	return (
		<Dialog maxWidth="sm" fullWidth open={open} onClose={handleRequestClose} aria-labelledby="extract-dialog-title">
			<Title id="extract-dialog-title" disableTypography>
				<Typography variant="h6">Extract cues from video</Typography>
				<IconButton aria-label="Close" edge="end" onClick={handleRequestClose}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<div className={classes.priceInfo}>
					<Typography gutterBottom>Transcription cost: (${cost.toFixed(2)})</Typography>
					<Typography variant="caption">
						The cost of this transcription will be deducted from your credit balance only if it completes successfully.
						It can take up to 20 minutes to complete the transcription process for an hour long video. Please be patient
						and do not close this window until your transcription completes.
					</Typography>
				</div>
				{extracting && (
					<UploadProgress progressBytes={progressBytes} totalBytes={totalBytes} uploadState={uploadState} />
				)}
				{!extracting && <LanguageSelector value={languageCode} onChange={setLanguageCode} />}
			</DialogContent>
			<DialogActions>
				<Button name="Extract Cues Cancel" onClick={handleRequestClose} color="primary" disabled={cancelDisabled}>
					Cancel
				</Button>
				<Button
					name="Extract Cues Confirm"
					onClick={extractCuesFromVideo}
					color="primary"
					variant="contained"
					disabled={extracting}>
					Extract cues
				</Button>
			</DialogActions>
		</Dialog>
	)
}

function recordS2TEvent(videoDuration) {
	const minutes = Math.round((videoDuration || 0) / 60) + ''
	window.gtag('event', `video_length_${minutes.padStart(2, '0')}`, {
		event_category: 'speech_to_text',
		value: videoDuration,
	})
}
