import * as React from 'react'
import download from 'downloadjs'
import {
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Hidden,
	IconButton,
	Menu,
	MenuItem,
	Tooltip,
} from '@material-ui/core'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import CloudUploadIcon from '@material-ui/icons/CloudUpload'
import DeleteIcon from '@material-ui/icons/Delete'
import MoreIcon from '@material-ui/icons/MoreVert'
import MovieIcon from '@material-ui/icons/Movie'
import {makeStyles} from '@material-ui/styles'
import {ExtractFromVideoMenuItem} from './CueExtractionButton'
import {TranslateMenuItem} from './TranslateButton'
import VTTMenuLogin from './VTTMenuLogin'
import {useFileSelector, useCues, Button, useCueFromFileLoader} from '../common'
import {getVTTFromCues} from '../services/vtt.service'
import {getSRTFromCues} from '../services/srt.service'
import SelectVideoButton from '../common/SelectVideoButton'

const useStyles = makeStyles({
	menuIcon: {
		marginRight: 16,
	},
})

export default function VTTMenu() {
	const classes = useStyles()
	const {cues, setCues} = useCues()
	const {loadCuesFromFile} = useCueFromFileLoader()

	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null)
	const [clearCuesDialogOpen, setClearCuesDialogOpen] = React.useState(false)

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null)
	}

	const onDownloadVTT = () => {
		download(getVTTFromCues(cues), 'my_captions.vtt', 'text/vtt')
		onCloseOptionsMenu()
	}

	const onDownloadSRT = () => {
		download(getSRTFromCues(cues), 'my_captions.srt', 'text/srt')
		onCloseOptionsMenu()
	}

	const onOpenClearCuesDialog = () => {
		setClearCuesDialogOpen(true)
		onCloseOptionsMenu()
	}

	const onCloseClearCuesDialog = () => {
		setClearCuesDialogOpen(false)
	}

	const onClearCues = () => {
		setCues([])
		setClearCuesDialogOpen(false)
	}

	const onFileSelected = React.useCallback(
		e => {
			onCloseOptionsMenu()
			loadCuesFromFile(e.target.files[0])
		},
		[loadCuesFromFile]
	)

	const openFileSelector = useFileSelector({accept: '.vtt,.srt', onFilesSelected: onFileSelected})

	return (
		<React.Fragment>
			<Tooltip title="Cue Options">
				<IconButton edge="end" color="inherit" aria-label="Menu" onClick={e => setOptionsMenuAnchorEl(e.currentTarget)}>
					<MoreIcon />
				</IconButton>
			</Tooltip>
			<Menu anchorEl={optionsMenuAnchorEl} open={!!optionsMenuAnchorEl} onClose={onCloseOptionsMenu}>
				<MenuItem onClick={openFileSelector}>
					<CloudUploadIcon className={classes.menuIcon} />
					Load from VTT or SRT file...
				</MenuItem>
				<Hidden mdUp>
					<SelectVideoButton
						element={
							<MenuItem>
								<MovieIcon className={classes.menuIcon} />
								Select Video File...
							</MenuItem>
						}
						onSelected={onCloseOptionsMenu}
					/>
				</Hidden>
				<ExtractFromVideoMenuItem classes={{menuIcon: classes.menuIcon}} onOpening={onCloseOptionsMenu} />
				<TranslateMenuItem classes={{menuIcon: classes.menuIcon}} onOpening={onCloseOptionsMenu} />
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
				<Hidden mdUp>
					<VTTMenuLogin />
				</Hidden>
			</Menu>
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
	)
}
