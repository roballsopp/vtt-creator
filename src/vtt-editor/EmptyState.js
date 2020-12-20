import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/AddCircle';
import VoiceChatIcon from '@material-ui/icons/VoiceChat';
import PublishIcon from '@material-ui/icons/Publish';
import { makeStyles } from '@material-ui/styles';
import { useFileSelector, Button, useCueFromFileLoader } from '../common';
import { ExtractFromVideoButton } from '../editor/CueExtractionButton';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		height: '100%',
		display: 'flex',
		padding: theme.spacing(8),
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
	},
	gutterBottom: {
		marginBottom: theme.spacing(8),
	},
	alignIcon: {
		verticalAlign: 'middle',
	},
}));

EmptyState.propTypes = {};

export default function EmptyState() {
	const classes = useStyles();
	const { loadCuesFromFile } = useCueFromFileLoader();

	const onVTTFileSelected = React.useCallback(
		e => {
			loadCuesFromFile(e.target.files[0]);
		},
		[loadCuesFromFile]
	);

	const openFileSelector = useFileSelector({ accept: '.vtt', onFilesSelected: onVTTFileSelected });

	return (
		<div className={classes.root}>
			<Typography align="center" className={classes.gutterBottom}>
				Add caption cues here by clicking the <AddIcon className={classes.alignIcon} /> button below, or by loading an
				existing VTT file from your computer.
			</Typography>
			<Button
				startIcon={<PublishIcon />}
				variant="contained"
				color="primary"
				onClick={openFileSelector}
				className={classes.gutterBottom}>
				Load VTT File
			</Button>
			<Typography align="center" className={classes.gutterBottom}>
				You can also let VTT Creator automatically extract captions straight from your video.
			</Typography>
			<ExtractFromVideoButton
				startIcon={<VoiceChatIcon />}
				variant="contained"
				color="primary"
				onClick={openFileSelector}>
				Extract from video
			</ExtractFromVideoButton>
		</div>
	);
}
