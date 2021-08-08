import * as React from 'react'
import {makeStyles} from '@material-ui/styles'
import {PlayingProvider} from '../common/video/playing-context'
import VideoControls from '../common/video/video-controls.component'
import VttTimeline from '../vtt-timeline'
import {OverlayProvider, VolumeProvider, SeekingProvider, useVideoDom} from '../common/video'
import Video from './video.component'

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	videoContainer: {
		flex: 1,
		backgroundColor: 'black',
		minHeight: 0,
		minWidth: 0,
	},
	video: {
		height: 'calc(100% - 38px)',
		margin: 'auto',
	},
	vttTimeline: {
		[theme.breakpoints.up('sm')]: {
			maxHeight: 200,
			flex: 1,
		},
		[theme.breakpoints.down('sm')]: {
			height: 70,
		},
	},
}))

export default function Player() {
	const classes = useStyles()
	const {onVideoContainerRef} = useVideoDom()

	return (
		<PlayingProvider>
			<VolumeProvider>
				<SeekingProvider>
					<OverlayProvider>
						<div className={classes.root}>
							<div ref={onVideoContainerRef} className={classes.videoContainer}>
								<Video className={classes.video} />
								<VideoControls />
							</div>
							<div className={classes.vttTimeline}>
								<VttTimeline />
							</div>
						</div>
					</OverlayProvider>
				</SeekingProvider>
			</VolumeProvider>
		</PlayingProvider>
	)
}
