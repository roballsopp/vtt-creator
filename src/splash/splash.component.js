import React from 'react'
import {useHistory} from 'react-router-dom'
import Typography from '@material-ui/core/Typography'
import {makeStyles} from '@material-ui/styles'
import muiBlueGreys from '@material-ui/core/colors/blueGrey'
import CloudDownloadIcon from '@material-ui/icons/CloudDownloadOutlined'
import MemoryIcon from '@material-ui/icons/MemorySharp'
import SubtitlesIcon from '@material-ui/icons/Subtitles'
import {Button} from '../common'
import {VC as VCIcon} from '../common/icons'
import BannerBgImg from '../../assets/banner_bg.jpg'
import Footer from '../footer.component'

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		position: 'absolute',
		top: 0,
		right: 0,
		bottom: 0,
		left: 0,
	},
	main: {
		display: 'flex',
		flexDirection: 'column',
		flex: 1,
		alignItems: 'center',
	},
	toolbar: {
		display: 'flex',
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		margin: 'auto',
		width: 1024,
		height: 64,
	},
	title: {
		display: 'flex',
		flexDirection: 'row',
		alignItems: 'center',
		marginBottom: 20,
	},
	titleIcon: {
		marginRight: 16,
		fontSize: 68,
	},
	tag: {
		marginBottom: 36,
	},
	banner: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		alignItems: 'center',
		width: '100%',
		backgroundPosition: 'center top',
		backgroundImage: `url(${BannerBgImg})`,
		backgroundColor: muiBlueGreys[900],
		color: 'white',
		padding: 60,
	},
	bannerButtonContainer: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},
	bannerButton: {
		padding: '16px 36px',
		fontSize: 18,
	},
	content: {
		flex: 1,
		display: 'flex',
		justifyContent: 'center',
	},
	features: {
		display: 'flex',
		justifyContent: 'space-between',
		width: 1024,
		margin: '50px 0',
	},
	feature: {
		width: 300,
		textAlign: 'center',
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
			<main className={classes.main}>
				<div className={classes.banner}>
					<div className={classes.title}>
						<VCIcon className={classes.titleIcon} />
						<Typography variant="h2" color="inherit">
							VTT Creator
						</Typography>
					</div>
					<Typography variant="h6" className={classes.tag}>
						An online editor and visualizer for video captions and subtitles.
					</Typography>
					<div className={classes.bannerButtonContainer}>
						<Button
							name="Create Captions"
							size="large"
							variant="contained"
							color="secondary"
							onClick={() => history.push('/editor')}>
							Create Captions
						</Button>
					</div>
				</div>
				<div className={classes.content}>
					<div className={classes.features}>
						<div className={classes.feature}>
							<SubtitlesIcon className={classes.featureIcon} />
							<Typography variant="h6">Load a video, and see your captions in action as you edit.</Typography>
						</div>
						<div className={classes.feature}>
							<MemoryIcon className={classes.featureIcon} />
							<Typography variant="h6">
								Leverage machine learning to automatically extract captions directly from your video.
							</Typography>
						</div>
						<div className={classes.feature}>
							<CloudDownloadIcon className={classes.featureIcon} />
							<Typography variant="h6">
								Export your work to a .vtt file for use anywhere on the web, or a .srt file for use offline.
							</Typography>
						</div>
					</div>
				</div>
			</main>
			<Footer />
		</div>
	)
}
