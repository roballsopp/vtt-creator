import * as React from 'react';
import * as PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { styled, makeStyles } from '@material-ui/styles';
import UploadProgress, {
	UPLOAD_STATE_COMPLETED,
	UPLOAD_STATE_EXTRACTING,
	UPLOAD_STATE_PROCESSING,
	UPLOAD_STATE_UPLOADING,
	UPLOAD_STATE_FAILED,
} from './upload-progress.component';
import LanguageSelector from './LanguageSelector';
import useApiHelper from './useApiHelper';
import { getAudioBlobFromVideo } from '../services/av.service';
import { handleError } from '../services/error-handler.service';
import { uploadFile } from '../services/rest-api.service';
import { useToast, Button, useVideoFile, useCredit } from '../common';
import { useDuration } from '../common/video';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

const useStyles = makeStyles(theme => ({
	priceInfo: {
		paddingTop: theme.spacing(2),
	},
}));

CueExtractionDialog.propTypes = {
	open: PropTypes.bool,
	onRequestClose: PropTypes.func.isRequired,
	onExtractComplete: PropTypes.func.isRequired,
};

export default function CueExtractionDialog({ open, onRequestClose, onExtractComplete }) {
	const { videoFile } = useVideoFile();
	const { duration } = useDuration();
	const { cost } = useCredit();
	const classes = useStyles();
	const [extracting, setExtracting] = React.useState(false);
	const [progressBytes, setProgressBytes] = React.useState(0);
	const [totalBytes, setTotalBytes] = React.useState(0);
	const [uploadState, setUploadState] = React.useState();
	const [languageCode, setLanguageCode] = React.useState('en-US');
	const operationIdRef = React.useRef('');

	const toast = useToast();
	const {
		getUploadUrl,
		initTranscription,
		pollTranscriptionJob,
		finishTranscription,
		failTranscription,
	} = useApiHelper();

	const handleFailure = () => {
		if (operationIdRef.current) {
			failTranscription(operationIdRef.current)
				.then(() => {
					operationIdRef.current = '';
				})
				.catch(handleError);
		}
	};

	const handleRequestClose = e => {
		if (uploadState === UPLOAD_STATE_PROCESSING) {
			handleFailure();
		}
		onRequestClose(e);
	};

	const extractCuesFromVideo = async e => {
		setExtracting(true);
		try {
			setUploadState(UPLOAD_STATE_EXTRACTING);
			const audioBlob = await getAudioBlobFromVideo(videoFile);

			setUploadState(UPLOAD_STATE_UPLOADING);
			const { filename, url } = await getUploadUrl();
			await uploadFile(audioBlob, url, e => {
				setProgressBytes(e.loaded);
				setTotalBytes(e.total);
			});

			setUploadState(UPLOAD_STATE_PROCESSING);
			const { operationId } = await initTranscription(filename, languageCode);
			operationIdRef.current = operationId;
			recordS2TEvent(duration);
			const results = await pollTranscriptionJob(operationId, 2000);

			setUploadState(UPLOAD_STATE_COMPLETED);

			if (results && results.length) {
				onExtractComplete(results);
				toast.success('Extraction successful!');
				onRequestClose(e);
				await finishTranscription(operationId);
			} else {
				toast.error('Unable to extract any audio!');
			}
		} catch (err) {
			setUploadState(UPLOAD_STATE_FAILED);
			handleError(err);
			toast.error('Oh no! Something went wrong!');
			// TODO: handle file cleanup when upload completes but job fails to start
			if (operationIdRef.current) handleFailure();
		}

		setExtracting(false);
	};

	return (
		<Dialog
			disableBackdropClick
			disableEscapeKeyDown
			maxWidth="sm"
			fullWidth
			open={open}
			onClose={handleRequestClose}
			aria-labelledby="extract-dialog-title">
			<Title id="extract-dialog-title" disableTypography>
				<Typography variant="h6">Extract cues from video</Typography>
				<IconButton aria-label="Close" edge="end" onClick={handleRequestClose}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				{extracting && (
					<UploadProgress progressBytes={progressBytes} totalBytes={totalBytes} uploadState={uploadState} />
				)}
				{!extracting && <LanguageSelector value={languageCode} onChange={setLanguageCode} />}
				<div className={classes.priceInfo}>
					<Typography variant="subtitle2">
						The cost (${cost.toFixed(2)}) of this transcription will be deducted from
						your credit balance only if it completes successfully.
					</Typography>
				</div>
			</DialogContent>
			<DialogActions>
				<Button name="Extract Cues Cancel" onClick={handleRequestClose} color="primary">
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
	);
}

function recordS2TEvent(videoDuration) {
	const minutes = Math.round((videoDuration || 0) / 60) + '';
	window.gtag('event', `video_length_${minutes.padStart(2, '0')}`, {
		event_category: 'speech_to_text',
		value: videoDuration,
	});
}
