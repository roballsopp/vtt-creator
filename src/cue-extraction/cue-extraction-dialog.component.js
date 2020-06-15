import * as React from 'react';
import * as PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import IconButton from '@material-ui/core/IconButton';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { styled } from '@material-ui/styles';
import UploadProgress, {
	UPLOAD_STATE_COMPLETED,
	UPLOAD_STATE_EXTRACTING,
	UPLOAD_STATE_PROCESSING,
	UPLOAD_STATE_UPLOADING,
	UPLOAD_STATE_FAILED,
} from './upload-progress.component';
import { getAudioBlobFromVideo } from '../services/av.service';
import { handleError } from '../services/error-handler.service';
import {
	getUploadUrl,
	deleteFile,
	initSpeechToTextOp,
	pollSpeechToTextOp,
	uploadFile,
	getSpeechToTextLanguages,
} from '../services/rest-api.service';
import { useToast, Button } from '../common';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

CueExtractionDialog.propTypes = {
	open: PropTypes.bool,
	videoFile: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.instanceOf(Blob)]),
	onRequestClose: PropTypes.func.isRequired,
	onExtractComplete: PropTypes.func.isRequired,
};

export default function CueExtractionDialog({ open, videoFile, onRequestClose, onExtractComplete }) {
	const [extracting, setExtracting] = React.useState(false);
	const [progressBytes, setProgressBytes] = React.useState(0);
	const [totalBytes, setTotalBytes] = React.useState(0);
	const [uploadState, setUploadState] = React.useState();
	const [languageCode, setLanguageCode] = React.useState('en-US');
	const [languages, setLanguages] = React.useState([]);
	const fileNameRef = React.useRef('');

	const toast = useToast();

	React.useEffect(() => {
		const getLanguages = async () => {
			const { languages } = await getSpeechToTextLanguages();
			setLanguages(languages);
		};
		getLanguages();
	}, []);

	const cleanup = async () => {
		if (fileNameRef.current) {
			try {
				await deleteFile(fileNameRef.current);
				fileNameRef.current = '';
			} catch (e) {
				handleError(e);
			}
		}
	};

	const handleRequestClose = e => {
		if (uploadState === UPLOAD_STATE_PROCESSING) {
			cleanup();
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
			fileNameRef.current = filename;
			await uploadFile(audioBlob, url, e => {
				setProgressBytes(e.loaded);
				setTotalBytes(e.total);
			});

			setUploadState(UPLOAD_STATE_PROCESSING);
			const { operationId } = await initSpeechToTextOp(filename, { languageCode });
			const results = await pollSpeechToTextOp(operationId, 2000);

			setUploadState(UPLOAD_STATE_COMPLETED);

			if (results.length) {
				onExtractComplete(results);
				toast.success('Upload successful!');
				onRequestClose(e);
			} else {
				toast.error('Unable to extract any audio!');
			}
		} catch (err) {
			setUploadState(UPLOAD_STATE_FAILED);
			handleError(err);
			toast.error('Oh no! Something went wrong!');
		}

		setExtracting(false);

		cleanup();
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
				{!extracting && (
					<FormControl>
						<InputLabel htmlFor="select-language">Language</InputLabel>
						<Select
							value={languageCode}
							onChange={e => setLanguageCode(e.target.value)}
							inputProps={{
								name: 'select-language',
								id: 'select-language',
							}}>
							{languages.map(lang => (
								<MenuItem key={lang.value} value={lang.value}>
									{lang.display}
								</MenuItem>
							))}
						</Select>
						<FormHelperText>In what language is the video content spoken?</FormHelperText>
					</FormControl>
				)}
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
