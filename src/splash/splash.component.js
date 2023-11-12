import React from 'react'
import {Box, Dialog, DialogActions, DialogContent, Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import muiBlueGreys from '@material-ui/core/colors/blueGrey'
import ArrowIcon from '@material-ui/icons/ArrowForward'
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined'
import CloudDownloadIcon from '@material-ui/icons/CloudDownloadOutlined'
import MemoryIcon from '@material-ui/icons/MemorySharp'
import SubtitlesIcon from '@material-ui/icons/Subtitles'
import TranslateIcon from '@material-ui/icons/Translate'
import {Button} from '../common'
import {BatchTranscribe} from '../common/icons'
import {VC as VCIcon} from '../common/icons'
import BannerBgImg from '../../assets/banner_bg.jpg'
import {handleError} from '../services/error-handler.service'

const useStyles = makeStyles((theme) => ({
	dialogRoot: {
		flex: 1,
		padding: theme.spacing(8, 16),
		overflowY: 'auto',
	},
	titleIcon: {
		marginRight: 16,
		fontSize: 68,
	},
	banner: {
		width: '100%',
		backgroundPosition: 'center top',
		backgroundImage: `url(${BannerBgImg})`,
		backgroundColor: muiBlueGreys[900],
		color: 'white',
	},
	featureIcon: {
		fontSize: 80,
	},
}))

export default function Splash() {
	const classes = useStyles()

	const splashDismissed = React.useMemo(() => getSplashDismissed(), [])

	const [openSplashDialog, setOpenSplashDialog] = React.useState(!splashDismissed)

	const handleCloseSplashDialog = () => {
		setOpenSplashDialog(false)
		setSplashDismissed()
	}

	return (
		<Dialog maxWidth="md" fullWidth open={openSplashDialog} onClose={handleCloseSplashDialog}>
			<div className={classes.banner}>
				<Box maxWidth={1024} py={8} px={4} margin="auto" overflow="hidden">
					<Grid container spacing={8}>
						<Grid item container xs={12} justifyContent="center" alignItems="center">
							<VCIcon className={classes.titleIcon} />
							<Typography variant="h2" align="center" color="inherit">
								VTT Creator
							</Typography>
						</Grid>
						<Grid item container xs={12} justifyContent="center" alignItems="center">
							<Typography variant="h6" align="center">
								An online editor and visualizer for video captions and subtitles.
							</Typography>
						</Grid>
					</Grid>
				</Box>
			</div>
			<DialogContent classes={{root: classes.dialogRoot}}>
				<Box overflow="hidden">
					<Grid container spacing={8}>
						<Grid
							item
							container
							xs={12}
							sm={6}
							lg={4}
							direction="column"
							alignItems="center"
							justifyContent="flex-start">
							<SubtitlesIcon className={classes.featureIcon} />
							<Typography variant="subtitle1" align="center">
								Load a video, and see your captions in action as you edit.
							</Typography>
						</Grid>
						<Grid
							item
							container
							xs={12}
							sm={6}
							lg={4}
							direction="column"
							alignItems="center"
							justifyContent="flex-start">
							<CloudUploadIcon className={classes.featureIcon} />
							<Typography variant="subtitle1" align="center">
								Import and edit existing .vtt and .srt files from your computer.
							</Typography>
						</Grid>
						<Grid
							item
							container
							xs={12}
							sm={6}
							lg={4}
							direction="column"
							alignItems="center"
							justifyContent="flex-start">
							<MemoryIcon className={classes.featureIcon} />
							<Typography variant="subtitle1" align="center">
								Leverage machine learning to automatically extract captions directly from your video.
							</Typography>
						</Grid>
						<Grid
							item
							container
							xs={12}
							sm={6}
							lg={4}
							direction="column"
							alignItems="center"
							justifyContent="flex-start">
							<TranslateIcon className={classes.featureIcon} />
							<Typography variant="subtitle1" align="center">
								Translate your captions automatically using Google Translate.
							</Typography>
						</Grid>
						<Grid
							item
							container
							xs={12}
							sm={6}
							lg={4}
							direction="column"
							alignItems="center"
							justifyContent="flex-start">
							<CloudDownloadIcon className={classes.featureIcon} />
							<Typography variant="subtitle1" align="center">
								Export your work to a .vtt file for use anywhere on the web, or a .srt file for use offline.
							</Typography>
						</Grid>
						<Grid
							item
							container
							xs={12}
							sm={6}
							lg={4}
							direction="column"
							alignItems="center"
							justifyContent="flex-start">
							<BatchTranscribe className={classes.featureIcon} />
							<Typography variant="subtitle1" align="center" gutterBottom>
								Automatically extract captions from many videos at once with Batch Transcribe
							</Typography>
						</Grid>
					</Grid>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button
					name="Create Captions"
					onClick={handleCloseSplashDialog}
					color="primary"
					variant="contained"
					endIcon={<ArrowIcon />}>
					Start Editing
				</Button>
			</DialogActions>
		</Dialog>
	)
}

const SPLASH_DISMISSED_KEY = 'vtt_creator_splash_dismissed'

function getSplashDismissed() {
	try {
		return JSON.parse(localStorage.getItem(SPLASH_DISMISSED_KEY))
	} catch (e) {
		handleError(e)
		// if local storage is failing, lets just never show the splash
		return true
	}
}

function setSplashDismissed() {
	try {
		localStorage.setItem(SPLASH_DISMISSED_KEY, JSON.stringify(true))
	} catch (e) {
		handleError(e)
	}
}
