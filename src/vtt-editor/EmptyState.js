import React from 'react'
import clsx from 'clsx'
import {Hidden, Typography} from '@material-ui/core'
import AddIcon from '@material-ui/icons/AddCircle'
import MoreIcon from '@material-ui/icons/MoreVert'
import FolderIcon from '@material-ui/icons/FolderOpen'
import CaptionsIcon from '@material-ui/icons/ClosedCaption'
import {makeStyles} from '@material-ui/styles'
import {useFileSelector, Button, useCueFromFileLoader} from '../common'
import {ExtractFromVideoButton} from '../editor/CueExtractionButton'

const useStyles = makeStyles(theme => ({
	root: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
		overflowY: 'scroll',
		padding: theme.spacing(8),
		[theme.breakpoints.up('sm')]: {
			display: 'flex',
			alignItems: 'center',
		},
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
	ie11Fix: {width: '100%', textAlign: 'center'},
}))

EmptyState.propTypes = {}

export default function EmptyState() {
	const classes = useStyles()
	const {loadCuesFromFile} = useCueFromFileLoader()

	const onVTTFileSelected = React.useCallback(
		e => {
			loadCuesFromFile(e.target.files[0])
		},
		[loadCuesFromFile]
	)

	const openFileSelector = useFileSelector({accept: '.vtt,.srt', onFilesSelected: onVTTFileSelected})

	return (
		<div className={classes.root}>
			<div>
				<div className={clsx(classes.gutterBottom, classes.ie11Fix)}>
					<Typography align="center">
						You can manually add caption cues here by clicking the <AddIcon className={classes.alignIcon} /> at the
						bottom of this pane.
					</Typography>
				</div>
				<div className={clsx(classes.actionGutter, classes.ie11Fix)}>
					<Typography align="center">
						You can also load captions from an existing VTT or SRT file on your computer:
					</Typography>
				</div>
				<div className={clsx(classes.gutterBottom, classes.ie11Fix)}>
					<Button startIcon={<FolderIcon />} variant="contained" color="secondary" onClick={openFileSelector}>
						Load from file
					</Button>
				</div>
				<div className={clsx(classes.actionGutter, classes.ie11Fix)}>
					<Typography align="center">
						You can even let VTT Creator automatically extract captions straight from your video:
					</Typography>
				</div>
				<div className={clsx(classes.gutterBottom, classes.ie11Fix)}>
					<ExtractFromVideoButton
						startIcon={<CaptionsIcon />}
						variant="contained"
						color="secondary"
						onClick={openFileSelector}>
						Extract from video
					</ExtractFromVideoButton>
				</div>
				<Hidden smDown>
					<div className={classes.ie11Fix}>
						<Typography align="center">See more options in the toolbar at the top of this pane.</Typography>
					</div>
				</Hidden>
				<Hidden smUp>
					<div className={classes.ie11Fix}>
						<Typography align="center">
							See more options in the <MoreIcon className={classes.alignIcon} /> menu at the top of the screen.
						</Typography>
					</div>
				</Hidden>
			</div>
		</div>
	)
}
