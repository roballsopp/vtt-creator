import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import AddIcon from '@material-ui/icons/AddCircle';
import MoreIcon from '@material-ui/icons/MoreVert';
import PublishIcon from '@material-ui/icons/Publish';
import VoiceChatIcon from '@material-ui/icons/VoiceChat';
import { makeStyles } from '@material-ui/styles';
import { useFileSelector, Button, useCueFromFileLoader } from '../common';
import { ExtractFromVideoButton } from '../editor/CueExtractionButton';

const useStyles = makeStyles(theme => ({
	root: {
		width: '100%',
		height: '100%',
		display: 'flex',
		padding: theme.spacing(8),
		alignItems: 'center',
	},
	actionGutter: {
		marginBottom: theme.spacing(4),
	},
	gutterBottom: {
		marginBottom: theme.spacing(8),
	},
	alignIcon: {
		verticalAlign: 'middle',
	},
	// apparently children of a flex container in ie11 need to be explicitly told to only take 100% width
	//  or else they won't wrap and will take _more_ than 100%
	ie11Fix: { width: '100%', textAlign: 'center' },
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
			<div className={classes.ie11Fix}>
				<Typography align="center" className={classes.gutterBottom}>
					You can manually add caption cues here by clicking the <AddIcon className={classes.alignIcon} /> at the bottom
					of this pane.
				</Typography>
				<Typography align="center" className={classes.actionGutter}>
					You can also load captions from an existing VTT file from your computer:
				</Typography>
				<Button
					startIcon={<PublishIcon />}
					variant="contained"
					color="primary"
					onClick={openFileSelector}
					className={classes.gutterBottom}>
					Load from VTT file
				</Button>
				<Typography align="center" className={classes.actionGutter}>
					You can even let VTT Creator automatically extract captions straight from your video:
				</Typography>
				<ExtractFromVideoButton
					startIcon={<VoiceChatIcon />}
					variant="contained"
					color="primary"
					onClick={openFileSelector}
					className={classes.gutterBottom}>
					Extract from video
				</ExtractFromVideoButton>
				<Typography align="center">
					See more options in the <MoreIcon className={classes.alignIcon} /> menu at the top of this pane.
				</Typography>
			</div>
		</div>
	);
}
