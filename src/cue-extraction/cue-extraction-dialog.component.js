import * as React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
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
import { getAudioBlobFromVideo } from '../services/av.service';
import { getUploadUrl, initSpeechToTextOp, pollSpeechToTextOp, uploadFile } from '../services/rest-api.service';

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
	const [languageCode, setLanguageCode] = React.useState('en-GB');

	const extractCuesFromVideo = async e => {
		setExtracting(true);

		try {
			const audioBlob = await getAudioBlobFromVideo(videoFile);
			const { url, filename } = await getUploadUrl();
			await uploadFile(audioBlob, url);
			const { operationId } = await initSpeechToTextOp(filename, { languageCode });
			const operation = await pollSpeechToTextOp(operationId);
			onExtractComplete(operation);
			onRequestClose(e);
		} catch (err) {
			console.error(err);
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
			onClose={onRequestClose}
			aria-labelledby="extract-dialog-title">
			<Title id="extract-dialog-title" disableTypography>
				<Typography variant="h6">Extract cues from video</Typography>
				<IconButton aria-label="Close" edge="end" onClick={onRequestClose} disabled={extracting}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<FormControl>
					<InputLabel htmlFor="select-language">Language</InputLabel>
					<Select
						value={languageCode}
						onChange={e => setLanguageCode(e.target.value)}
						inputProps={{
							name: 'select-language',
							id: 'select-language',
						}}>
						<MenuItem value="en-US">English (American)</MenuItem>
						<MenuItem value="en-GB">English (British)</MenuItem>
					</Select>
					<FormHelperText>In what language is the video content spoken?</FormHelperText>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={onRequestClose} color="primary" disabled={extracting}>
					Cancel
				</Button>
				<Button onClick={extractCuesFromVideo} color="primary" variant="contained" disabled={extracting}>
					Extract cues
				</Button>
			</DialogActions>
		</Dialog>
	);
}
