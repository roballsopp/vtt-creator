import * as React from 'react';
import download from 'downloadjs';
import Button from '@material-ui/core/Button';
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
import DonateDialog from './donate-dialog.component';
import { useFileSelector, useToast, useCues, useVideoFile } from '../common';
import { getVTTFromCues, getCuesFromWords, getCuesFromVTT } from '../services/vtt.service';
import { S2T_REQUEST_COUNT } from '../services/rest-api.service';
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

	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null);
	const [clearCuesDialogOpen, setClearCuesDialogOpen] = React.useState(false);
	const [cueExtractionDialogOpen, setCueExtractionDialogOpen] = React.useState(false);
	const [donateDialogOpen, setDonateDialogOpen] = React.useState(false);

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null);
	};

	const onOpenCueExtractionDialog = () => {
		const count = parseInt(localStorage.getItem(S2T_REQUEST_COUNT) || 0);

		// ask for donation every other use of the api
		if (count > 0 && count % 2) {
			setCueExtractionDialogOpen(true);
			onCloseOptionsMenu();
		} else {
			onOpenDonateDialog();
		}
	};

	const onCloseCueExtractionDialog = () => {
		setCueExtractionDialogOpen(false);
	};

	const onOpenDonateDialog = () => {
		setDonateDialogOpen(true);
		onCloseOptionsMenu();
	};

	const onCloseDonateDialog = () => {
		setDonateDialogOpen(false);
		setCueExtractionDialogOpen(true);
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
				<MenuItem disabled={apiDisabled || !videoFile} onClick={onOpenCueExtractionDialog}>
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
					videoFile={videoFile}
					onRequestClose={onCloseCueExtractionDialog}
					onExtractComplete={onCueExtractComplete}
				/>
			)}
			<DonateDialog open={donateDialogOpen} onClose={onCloseDonateDialog} />
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
					<Button onClick={onCloseClearCuesDialog} color="primary">
						Cancel
					</Button>
					<Button onClick={onClearCues} color="primary" variant="contained">
						Yes, Delete Cues
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
