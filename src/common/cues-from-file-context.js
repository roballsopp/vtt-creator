import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import IconButton from '@material-ui/core/IconButton'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import {styled, makeStyles} from '@material-ui/styles'
import React from 'react'
import PropTypes from 'prop-types'
import {handleError} from '../services/error-handler.service'
import {
	getCuesFromVTT,
	EmptyVTTFileError,
	MalformedVTTSignatureError,
	MalformedVTTTimestampError,
} from '../services/vtt.service'
import {getCuesFromSRT, EmptySRTFileError, MalformedSRTTimestampError} from '../services/srt.service'
import {ExtendableError} from '../errors'
import Button from './button.component'
import {useCues} from './cue-context'
import {useToast} from './toast-context'

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
})

const useStyles = makeStyles(theme => ({
	code: {
		fontFamily: 'monospace',
		fontSize: 16,
		color: theme.palette.common.white,
		whiteSpace: 'pre',
		padding: theme.spacing(2),
		backgroundColor: theme.palette.grey[900],
		margin: theme.spacing(0, 6, 6, 4),
	},
	monoSpaced: {
		fontFamily: 'monospace',
		backgroundColor: theme.palette.grey[300],
		fontSize: 16,
	},
}))

const CuesFromFileContext = React.createContext({
	loadCuesFromFile: () => {},
})

CuesFromFileProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function CuesFromFileProvider({children}) {
	const classes = useStyles()
	const {setCues, setCuesLoading} = useCues()
	const toast = useToast()
	const [malformedVTTDialogState, setMalformedVTTDialogState] = React.useState({message: '', open: false})
	const [malformedSRTDialogState, setMalformedSRTDialogState] = React.useState({message: '', open: false})

	const loadCuesFromFile = React.useCallback(
		async file => {
			setCuesLoading(true)
			try {
				const newCues = await loadByExtension(file)
				setCues(newCues) // check if VTT files require ordering
			} catch (e) {
				if (e instanceof EmptyVTTFileError) {
					toast.error('This VTT file appears to be empty.')
				} else if (e instanceof EmptySRTFileError) {
					toast.error('This SRT file appears to be empty.')
				} else if (e instanceof UnsupportedExtensionError) {
					toast.error('Please choose a file with either a .srt or .vtt extension')
				} else if (e instanceof MalformedVTTTimestampError) {
					setMalformedVTTDialogState({
						open: true,
						message: `Couldn't extract cues due to a malformed VTT timestamp: "${e.badTimeStamp}"`,
					})
				} else if (e instanceof MalformedVTTSignatureError) {
					setMalformedVTTDialogState({
						open: true,
						message: `Couldn't extract cues due to a missing or invalid "WEBVTT" header.`,
					})
				} else if (e instanceof MalformedSRTTimestampError) {
					setMalformedSRTDialogState({
						open: true,
						message: `Couldn't extract cues due to a malformed SRT timestamp: "${e.badTimeStamp}"`,
					})
				} else {
					handleError(e)
					toast.error('Oh no! An error occurred loading the cues.')
				}
			}
			setCuesLoading(false)
		},
		[setCues, setCuesLoading, toast]
	)

	const handleMalformedVTTDialogClose = (e, reason) => {
		if (['backdropClick', 'escapeKeyDown'].includes(reason)) {
			return
		}
		setMalformedVTTDialogState({open: false, message: ''})
	}

	const handleMalformedSRTDialogClose = (e, reason) => {
		if (['backdropClick', 'escapeKeyDown'].includes(reason)) {
			return
		}
		setMalformedSRTDialogState({open: false, message: ''})
	}

	return (
		<CuesFromFileContext.Provider value={React.useMemo(() => ({loadCuesFromFile}), [loadCuesFromFile])}>
			{children}
			<Dialog
				maxWidth="md"
				fullWidth
				open={malformedVTTDialogState.open}
				onClose={handleMalformedVTTDialogClose}
				aria-labelledby="extract-dialog-title">
				<Title id="extract-dialog-title" disableTypography>
					<Typography variant="h6">Malformed VTT File</Typography>
					<IconButton aria-label="Close" edge="end" onClick={handleMalformedVTTDialogClose}>
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
						<span className={classes.monoSpaced}>00:00:00.000</span>.
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
					<Button onClick={handleMalformedVTTDialogClose} variant="contained" color="secondary">
						Got it!
					</Button>
				</DialogActions>
			</Dialog>
			<Dialog
				maxWidth="md"
				fullWidth
				open={malformedSRTDialogState.open}
				onClose={handleMalformedSRTDialogClose}
				aria-labelledby="extract-dialog-title">
				<Title id="extract-dialog-title" disableTypography>
					<Typography variant="h6">Malformed SRT File</Typography>
					<IconButton aria-label="Close" edge="end" onClick={handleMalformedSRTDialogClose}>
						<CloseIcon />
					</IconButton>
				</Title>
				<DialogContent>
					<Typography variant="h6" paragraph color="error">
						{malformedSRTDialogState.message}
					</Typography>
					<Typography paragraph>
						SRT files are normal text files that must adhere to a specific format. You can check to see whats wrong with
						your file using a simple text editor (like notepad, but not Microsoft Word).
					</Typography>
					<Typography paragraph>Make sure the first line of each cue is a number:</Typography>
					<div className={classes.code}>
						1<br />
						00:00:11,000 --&gt; 00:00:13,000
						<br />
						We are in New York City
					</div>
					<Typography paragraph>
						The second line of each cue should have a start and end timestamp in the correct format. SRT timestamps
						should have the form: <span className={classes.monoSpaced}>HH:MM:SS,MMM</span>.
						<Typography paragraph>Note the comma between the seconds and milliseconds places.</Typography>
					</Typography>
					<Typography paragraph gutterBottom>
						Here is an example of what a simple SRT file should look like:
					</Typography>
					{/*prettier-ignore*/}
					<div className={classes.code}>
						1<br />
						00:00:11,020 --&gt; 00:00:13,110<br />
						We are in New York City<br />
						<br />
						2<br />
						00:00:13,110 --&gt; 00:00:16,562<br />
						We’re actually at the Lucern Hotel, just down the street<br />
						<br />
						3<br />
						00:00:16,562 --&gt; 00:00:18,954<br />
						from the American Museum of Natural History
					</div>
				</DialogContent>
				<DialogActions>
					<Button onClick={handleMalformedSRTDialogClose} variant="contained" color="secondary">
						Got it!
					</Button>
				</DialogActions>
			</Dialog>
		</CuesFromFileContext.Provider>
	)
}

export function useCueFromFileLoader() {
	return React.useContext(CuesFromFileContext)
}

export class UnsupportedExtensionError extends ExtendableError {
	constructor(ext, m = 'Unsupported extension') {
		super(m)
		this.name = 'UnsupportedExtensionError'
		this.ext = ext
	}
}

function loadByExtension(file) {
	const ext = file.name.split('.').pop()
	switch (ext) {
		case 'vtt':
			return getCuesFromVTT(file)
		case 'srt':
			return getCuesFromSRT(file)
		default:
			return Promise.reject(new UnsupportedExtensionError(ext, `Unsupported extension ${ext}`))
	}
}
