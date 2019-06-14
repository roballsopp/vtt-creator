import * as React from 'react';
import download from 'downloadjs';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import MoreIcon from '@material-ui/icons/MoreVert';
import VoiceChatIcon from '@material-ui/icons/VoiceChat';
import { makeStyles } from '@material-ui/styles';
import { useFileSelector, useToast, useCues, useVideoFile } from './common';
import { getVTTFromCues, getCuesFromWords, getCuesFromVTT } from './services/vtt.service';
import CueExtractionDialog from './cue-extraction/cue-extraction-dialog.component';
import { apiDisabled } from './config';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		height: '100%',
	},
	drawer: {
		zIndex: 2,
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	main: {
		padding: 8,
		flex: 1,
	},
	menuIcon: {
		marginRight: 16,
	},
});

export default function MainScreen() {
	const classes = useStyles();
	const toast = useToast();
	const { cues, onChangeCues, onLoadingCues } = useCues();
	const { videoFile } = useVideoFile();

	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null);
	const [cueExtractionDialogOpen, setCueExtractionDialogOpen] = React.useState(false);

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null);
	};

	const onOpenCueExtractionDialog = () => {
		setCueExtractionDialogOpen(true);
		onCloseOptionsMenu();
	};

	const onCloseCueExtractionDialog = () => {
		setCueExtractionDialogOpen(false);
	};

	const onCueExtractComplete = results => {
		onLoadingCues(true);
		const newCues = getCuesFromWords(results.words);
		onChangeCues(newCues);
		onLoadingCues(false);
	};

	const onDownloadVTT = () => {
		download(getVTTFromCues(cues), 'my_captions.vtt', 'text/vtt');
		onCloseOptionsMenu();
	};

	const onVTTFileSelected = React.useCallback(
		async e => {
			onCloseOptionsMenu();
			onLoadingCues(true);
			try {
				const newCues = await getCuesFromVTT(e.target.files[0]);
				onChangeCues(newCues, true); // check if VTT files require ordering
			} catch (e) {
				console.error(e);
				toast.error('Oh no! An error occurred loading the cues.');
			}
			onLoadingCues(false);
		},
		[onChangeCues, onLoadingCues, toast]
	);

	const openFileSelector = useFileSelector({ accept: '.vtt', onFilesSelected: onVTTFileSelected });

	return (
		<React.Fragment>
			<IconButton edge="end" color="inherit" aria-label="Menu" onClick={e => setOptionsMenuAnchorEl(e.currentTarget)}>
				<MoreIcon />
			</IconButton>
			<Menu anchorEl={optionsMenuAnchorEl} open={!!optionsMenuAnchorEl} onClose={onCloseOptionsMenu}>
				<MenuItem onClick={openFileSelector}>
					<CloudUploadIcon className={classes.menuIcon} />
					Load from VTT file...
				</MenuItem>
				<MenuItem disabled={apiDisabled || !videoFile} onClick={onOpenCueExtractionDialog}>
					<VoiceChatIcon className={classes.menuIcon} />
					Extract from video...
				</MenuItem>
				<MenuItem onClick={onDownloadVTT}>
					<CloudDownloadIcon className={classes.menuIcon} />
					Save to VTT file...
				</MenuItem>
			</Menu>
			{!apiDisabled && (
				<CueExtractionDialog
					open={cueExtractionDialogOpen}
					videoFile={videoFile}
					onRequestClose={onCloseCueExtractionDialog}
					onExtractComplete={onCueExtractComplete}
				/>
			)}
		</React.Fragment>
	);
}
