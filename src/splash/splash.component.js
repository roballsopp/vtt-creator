import React from 'react'
import {useHistory} from 'react-router-dom'
import {Box, Grid, Typography} from '@material-ui/core'
import {makeStyles} from '@material-ui/styles'
import muiBlueGreys from '@material-ui/core/colors/blueGrey'
import ArrowIcon from '@material-ui/icons/ArrowForward'
import CloudUploadIcon from '@material-ui/icons/CloudUploadOutlined'
import CloudDownloadIcon from '@material-ui/icons/CloudDownloadOutlined'
import MemoryIcon from '@material-ui/icons/MemorySharp'
import SubtitlesIcon from '@material-ui/icons/Subtitles'
import TranslateIcon from '@material-ui/icons/Translate'
import {Button} from '../common'
import {VC as VCIcon} from '../common/icons'
import BannerBgImg from '../../assets/banner_bg.jpg'
import Footer from '../footer.component'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		minHeight: 0,
		minWidth: 0,
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
	bannerButtonContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	featureIcon: {
		fontSize: 80,
	},
})

export default function Splash() {
	const classes = useStyles()
	const history = useHistory()

	return (
		<div className={classes.root}>
			<Box component="main" display="flex" flex={1} flexDirection="column" alignItems="center">
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
							<Grid item container xs={12} justifyContent="center" alignItems="center">
								<Button
									name="Create Captions"
									size="large"
									variant="contained"
									color="secondary"
									endIcon={<ArrowIcon />}
									onClick={() => history.push('/editor')}>
									Create Captions
								</Button>
							</Grid>
						</Grid>
					</Box>
				</div>
				<Box maxWidth={1024} py={8} px={4} overflow="hidden">
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
					</Grid>
				</Box>
			</Box>
			<Footer />
		</div>
	)
}
