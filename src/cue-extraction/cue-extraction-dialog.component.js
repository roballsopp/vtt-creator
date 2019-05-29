import * as React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button/index';
import Dialog from '@material-ui/core/Dialog/index';
import DialogActions from '@material-ui/core/DialogActions/index';
import DialogContent from '@material-ui/core/DialogContent/index';
import DialogTitle from '@material-ui/core/DialogTitle/index';
import FormControl from '@material-ui/core/FormControl/index';
import InputLabel from '@material-ui/core/InputLabel/index';
import MenuItem from '@material-ui/core/MenuItem/index';
import Select from '@material-ui/core/Select/index';
import { getAudioBlobFromVideo } from '../services/av.service';
import { getUploadUrl, initSpeechToTextOp, pollSpeechToTextOp, uploadFile } from '../services/rest-api.service';

CueExtractionDialog.propTypes = {
	open: PropTypes.bool,
	videoFile: PropTypes.oneOfType([PropTypes.instanceOf(File), PropTypes.instanceOf(Blob)]),
	onRequestClose: PropTypes.func.isRequired,
	onExtractComplete: PropTypes.func.isRequired,
};

export default function CueExtractionDialog({ open, videoFile, onRequestClose, onExtractComplete }) {
	const [extracting, setExtracting] = React.useState(false);
	const [language, setLanguage] = React.useState('en-GB');

	const extractCuesFromVideo = async e => {
		setExtracting(true);

		try {
			const audioBlob = await getAudioBlobFromVideo(videoFile);
			const { url, filename } = await getUploadUrl();
			await uploadFile(audioBlob, url);
			const { operationId } = await initSpeechToTextOp(filename);
			const operation = await pollSpeechToTextOp(operationId);
			onExtractComplete(operation);
			onRequestClose(e);
		} catch (err) {
			console.error(err);
		}

		setExtracting(false);
	};

	return (
		<Dialog maxWidth="sm" fullWidth open={open} onClose={onRequestClose} aria-labelledby="extract-dialog-title">
			<DialogTitle id="extract-dialog-title">Extract cues from video</DialogTitle>
			<DialogContent>
				<FormControl>
					<InputLabel htmlFor="select-language">Language</InputLabel>
					<Select
						value={language}
						onChange={e => setLanguage(e.target.value)}
						inputProps={{
							name: 'select-language',
							id: 'select-language',
						}}>
						<MenuItem value="en-US">English (American)</MenuItem>
						<MenuItem value="en-GB">English (British)</MenuItem>
					</Select>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button onClick={onRequestClose} color="primary">
					Cancel
				</Button>
				<Button onClick={extractCuesFromVideo} color="primary" disabled={extracting}>
					Extract cues
				</Button>
			</DialogActions>
		</Dialog>
	);
}
