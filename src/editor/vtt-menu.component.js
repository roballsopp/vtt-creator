import * as React from 'react';
import download from 'downloadjs';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteIcon from '@material-ui/icons/Delete';
import MoreIcon from '@material-ui/icons/MoreVert';
import VoiceChatIcon from '@material-ui/icons/VoiceChat';
import { makeStyles } from '@material-ui/styles';
import LoginDialog from './LoginDialog';
import CreditDialog from './CreditDialog';
import { useFileSelector, useToast, useCues, useVideoFile, Button, useAuth, useCredit } from '../common';
import { getVTTFromCues, getCuesFromWords, getCuesFromVTT } from '../services/vtt.service';
import { getSRTFromCues } from '../services/srt.service';
import { handleError } from '../services/error-handler.service';
import CueExtractionDialog from '../cue-extraction/cue-extraction-dialog.component';
import { apiDisabled } from '../config';

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

export default function VTTMenu() {
	const classes = useStyles();
	const toast = useToast();
	const { cues, onChangeCues, onLoadingCues } = useCues();
	const { videoFile } = useVideoFile();
	const { isAuthenticated } = useAuth();
	const { cost, credit } = useCredit();

	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null);
	const [clearCuesDialogOpen, setClearCuesDialogOpen] = React.useState(false);
	const [cueExtractionDialogOpen, setCueExtractionDialogOpen] = React.useState(false);
	const [loginDialogOpen, setLoginDialogOpen] = React.useState(false);
	const [creditDialogOpen, setCreditDialogOpen] = React.useState(false);

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null);
	};

	const handleOpenCueExtractionDialog = () => {
		onCloseOptionsMenu();

		if (!isAuthenticated) {
			return setLoginDialogOpen(true);
		}

		if (cost > credit) {
			return setCreditDialogOpen(true);
		}

		setCueExtractionDialogOpen(true);
	};

	const onCloseCueExtractionDialog = () => {
		setCueExtractionDialogOpen(false);
	};

	const handleLoginDialogClose = () => {
		setLoginDialogOpen(false);
	};

	const handleLoginDialogExited = () => {
		if (isAuthenticated) {
			handleOpenCueExtractionDialog();
		}
	};

	const handleCreditDialogClose = () => {
		setCreditDialogOpen(false);
	};

	const handleCreditDialogExited = () => {
		handleOpenCueExtractionDialog();
	};

	const onCueExtractComplete = segments => {
		onLoadingCues(true);
		// for how this concatenation stuff works: https://cloud.google.com/speech-to-text/docs/basics#transcriptions
		const words = segments.reduce((arr, { alternatives }) => {
			return arr.concat(alternatives[0].words);
		}, []);
		const newCues = getCuesFromWords(words);
		onChangeCues(newCues);
		onLoadingCues(false);
	};

	const onDownloadVTT = () => {
		download(getVTTFromCues(cues), 'my_captions.vtt', 'text/vtt');
		onCloseOptionsMenu();
	};

	const onDownloadSRT = () => {
		download(getSRTFromCues(cues), 'my_captions.srt', 'text/srt');
		onCloseOptionsMenu();
	};

	const onOpenClearCuesDialog = () => {
		setClearCuesDialogOpen(true);
		onCloseOptionsMenu();
	};

	const onCloseClearCuesDialog = () => {
		setClearCuesDialogOpen(false);
	};

	const onClearCues = () => {
		onChangeCues([]);
		setClearCuesDialogOpen(false);
	};

	const onVTTFileSelected = React.useCallback(
		async e => {
			onCloseOptionsMenu();
			onLoadingCues(true);
			try {
				const newCues = await getCuesFromVTT(e.target.files[0]);
				onChangeCues(newCues, true); // check if VTT files require ordering
			} catch (e) {
				handleError(e);
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
				<MenuItem disabled={apiDisabled || !videoFile} onClick={handleOpenCueExtractionDialog}>
					<VoiceChatIcon className={classes.menuIcon} />
					Extract from video...
				</MenuItem>
				<MenuItem onClick={onDownloadVTT}>
					<CloudDownloadIcon className={classes.menuIcon} />
					Save to VTT file...
				</MenuItem>
				<MenuItem onClick={onDownloadSRT}>
					<CloudDownloadIcon className={classes.menuIcon} />
					Save to SRT file...
				</MenuItem>
				<MenuItem disabled={!cues.length} onClick={onOpenClearCuesDialog}>
					<DeleteIcon className={classes.menuIcon} />
					Clear Cues
				</MenuItem>
			</Menu>
			{!apiDisabled && (
				<CueExtractionDialog
					open={cueExtractionDialogOpen}
					onRequestClose={onCloseCueExtractionDialog}
					onExtractComplete={onCueExtractComplete}
				/>
			)}
			<LoginDialog open={loginDialogOpen} onExited={handleLoginDialogExited} onClose={handleLoginDialogClose} />
			<CreditDialog open={creditDialogOpen} onExited={handleCreditDialogExited} onClose={handleCreditDialogClose} />
			<Dialog
				maxWidth="sm"
				fullWidth
				open={clearCuesDialogOpen}
				onClose={onCloseClearCuesDialog}
				aria-labelledby="extract-dialog-title">
				<DialogTitle id="extract-dialog-title">Are you sure you want to delete your cues?</DialogTitle>
				<DialogContent>
					This will delete all the cues you have created or extracted, and you&apos;ll have to start over. Are you sure
					you want to proceed?
				</DialogContent>
				<DialogActions>
					<Button name="Delete Cues Cancel" onClick={onCloseClearCuesDialog} color="primary">
						Cancel
					</Button>
					<Button name="Delete Cues Confirm" onClick={onClearCues} color="primary" variant="contained">
						Yes, Delete Cues
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
