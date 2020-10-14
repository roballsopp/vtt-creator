import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { styled, makeStyles } from '@material-ui/styles';
import React from 'react';
import PropTypes from 'prop-types';
import { handleError } from '../services/error-handler.service';
import {
	EmptyFileError,
	getCuesFromVTT,
	MalformedVTTSignatureError,
	MalformedVTTTimestampError,
} from '../services/vtt.service';
import Button from './button.component';
import { useCues } from './cue-context';
import { useToast } from './toast-context';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

const useStyles = makeStyles(theme => ({
	code: {
		fontFamily: 'monospace',
		fontSize: 16,
		color: theme.palette.common.white,
		whiteSpace: 'pre',
		padding: theme.spacing(1),
		backgroundColor: theme.palette.grey[900],
		margin: theme.spacing(0, 3),
	},
	monoSpaced: {
		fontFamily: 'monospace',
		backgroundColor: theme.palette.grey[300],
		fontSize: 16,
	},
}));

const CuesFromFileContext = React.createContext({
	loadCuesFromFile: () => {},
});

CuesFromFileProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function CuesFromFileProvider({ children }) {
	const classes = useStyles();
	const { onChangeCues, onLoadingCues } = useCues();
	const toast = useToast();
	const [malformedVTTDialogState, setMalformedVTTDialogState] = React.useState({ message: '', open: false });

	const loadCuesFromFile = React.useCallback(
		async file => {
			onLoadingCues(true);
			try {
				const newCues = await getCuesFromVTT(file);
				onChangeCues(newCues, true); // check if VTT files require ordering
			} catch (e) {
				if (e instanceof EmptyFileError) {
					toast.error('This VTT file appears to be empty.');
				} else if (e instanceof MalformedVTTTimestampError) {
					setMalformedVTTDialogState({
						open: true,
						message: `Couldn't extract cues due to a malformed VTT timestamp: "${e.badTimeStamp}"`,
					});
				} else if (e instanceof MalformedVTTSignatureError) {
					setMalformedVTTDialogState({
						open: true,
						message: `Couldn't extract cues due to a missing or invalid "WEBVTT" header.`,
					});
				} else {
					handleError(e);
					toast.error('Oh no! An error occurred loading the cues.');
				}
			}
			onLoadingCues(false);
		},
		[onChangeCues, onLoadingCues, toast]
	);

	const handleMalformedDialogClose = () => {
		setMalformedVTTDialogState({ open: false, message: '' });
	};

	return (
		<CuesFromFileContext.Provider value={React.useMemo(() => ({ loadCuesFromFile }), [loadCuesFromFile])}>
			{children}
			<Dialog
				disableBackdropClick
				disableEscapeKeyDown
				maxWidth="md"
				fullWidth
				open={malformedVTTDialogState.open}
				onClose={handleMalformedDialogClose}
				aria-labelledby="extract-dialog-title">
				<Title id="extract-dialog-title" disableTypography>
					<Typography variant="h6">Malformed VTT File</Typography>
					<IconButton aria-label="Close" edge="end" onClick={handleMalformedDialogClose}>
						<CloseIcon />
					</IconButton>
				</Title>
				<DialogContent>
					<Typography variant="h6" paragraph color="error">
						{malformedVTTDialogState.message}
					</Typography>
					<Typography paragraph>
						VTT files are normal text files that must adhere to a specific format. You can check to see whats wrong with
						your file using a simple text editor (like notepad, but not Microsoft Word).
					</Typography>
					<Typography paragraph>
						First, make sure the file begins with the word <span className={classes.monoSpaced}>WEBVTT</span> in all
						capital letters.
					</Typography>
					<Typography paragraph>
						Also make sure each timestamp conforms to the correct format. VTT timestamps should have the form{' '}
						<span className={classes.monoSpaced}>00:00.000</span> or{' '}
						<span className={classes.monoSpaced}>00:00:00.000</span>. If a comma appears in the timestamp (
						<span className={classes.monoSpaced}>00:00:00,000</span>), you may be attempting to load an SRT file, which
						is similar, but doesn&apos;t have the same format as a VTT file.
					</Typography>
					<Typography paragraph gutterBottom>
						Here is an example of what a simple VTT file should look like:
					</Typography>
					{/*prettier-ignore*/}
					<div className={classes.code}>
						WEBVTT<br />
						<br />
						00:11.000 --&gt; 00:13.000<br />
						We are in New York City<br />
						<br />
						00:13.000 --&gt; 00:16.000<br />
						We’re actually at the Lucern Hotel, just down the street<br />
						<br />
						00:16.000 --&gt; 00:18.000<br />
						from the American Museum of Natural History
				</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleMalformedDialogClose} variant="contained" color="secondary">
						Got it!
					</Button>
				</DialogActions>
			</Dialog>
		</CuesFromFileContext.Provider>
	);
}

export function useCueFromFileLoader() {
	return React.useContext(CuesFromFileContext);
}
