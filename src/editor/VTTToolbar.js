import * as React from 'react'
import download from 'downloadjs'
import {ButtonGroup, Menu, MenuItem, Tooltip} from '@material-ui/core'
import DeleteIcon from '@material-ui/icons/DeleteForever'
import FolderIcon from '@material-ui/icons/FolderOpen'
import SaveIcon from '@material-ui/icons/Save'
import {makeStyles} from '@material-ui/styles'
import {ExtractFromVideoToolbarButton} from './CueExtractionButton'
import {TranslateToolbarButton} from './TranslateButton'
import ClearCuesDialog from './ClearCuesDialog'
import {useFileSelector, useCues, Button, useCueFromFileLoader} from '../common'
import {getVTTFromCues} from '../services/vtt.service'
import {getSRTFromCues} from '../services/srt.service'

const useStyles = makeStyles(theme => ({
	root: {
		boxShadow: theme.shadows[3],
		backgroundImage: `linear-gradient(white, white 30%, #CCCCDD)`,
		color: theme.palette.grey[700],
		// raises this just above the vtt editor so the scrollbar is not in front of the toolbar shadow
		zIndex: 1,
	},
	menuIcon: {
		marginRight: 16,
	},
}))

export default function VTTToolbar() {
	const classes = useStyles()
	const {cues} = useCues()
	const {loadCuesFromFile} = useCueFromFileLoader()

	const [saveMenuAnchorEl, setSaveMenuAnchorEl] = React.useState(null)
	const [clearCuesDialogOpen, setClearCuesDialogOpen] = React.useState(false)

	const onCloseOptionsMenu = () => {
		setSaveMenuAnchorEl(null)
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
	}

	const handleCloseClearCuesDialog = () => {
		setClearCuesDialogOpen(false)
	}

	const onFileSelected = React.useCallback(
		e => {
			loadCuesFromFile(e.target.files[0])
		},
		[loadCuesFromFile]
	)

	const openFileSelector = useFileSelector({accept: '.vtt,.srt', onFilesSelected: onFileSelected})

	return (
		<div className={classes.root}>
			<ButtonGroup variant="text" color="inherit">
				<Button onClick={openFileSelector}>
					<Tooltip title="Load captions from file">
						<FolderIcon />
					</Tooltip>
				</Button>
				<Button onClick={e => setSaveMenuAnchorEl(e.currentTarget)}>
					<Tooltip title="Save captions to file">
						<SaveIcon />
					</Tooltip>
				</Button>
				<ExtractFromVideoToolbarButton />
				<TranslateToolbarButton />
				<Button disabled={!cues.length} onClick={onOpenClearCuesDialog}>
					<Tooltip title="Clear captions">
						<DeleteIcon />
					</Tooltip>
				</Button>
			</ButtonGroup>
			<ClearCuesDialog open={clearCuesDialogOpen} onClose={handleCloseClearCuesDialog} />
			<Menu
				getContentAnchorEl={null}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'left',
				}}
				anchorEl={saveMenuAnchorEl}
				open={Boolean(saveMenuAnchorEl)}
				onClose={onCloseOptionsMenu}>
				<MenuItem onClick={onDownloadVTT}>Save to VTT file</MenuItem>
				<MenuItem onClick={onDownloadSRT}>Save to SRT file</MenuItem>
			</Menu>
		</div>
	)
}
