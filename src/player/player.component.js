import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import VideoControls from '../common/video/video-controls.component';
import VttTimeline from '../vtt-timeline';
import { OverlayProvider } from '../common/video';
import Video from './video.component';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	videoContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'center',
		flex: 1,
		backgroundColor: 'black',
		color: 'white',
		minHeight: 0,
		minWidth: 0,
	},
	video: {
		height: 'calc(100% - 30px)',
		margin: 'auto',
		maxWidth: 1000,
	},
	videoControls: {
		height: 30,
	},
	vttTimeline: {
		flex: 1,
		maxHeight: 300,
		minHeight: 100,
	},
});

export default function Player() {
	const classes = useStyles();

	return (
		<OverlayProvider>
			<div className={classes.root}>
				<div className={classes.videoContainer}>
					<Video className={classes.video} />
					<VideoControls className={classes.videoControls} />
				</div>
				<div className={classes.vttTimeline}>
					<VttTimeline />
				</div>
			</div>
		</OverlayProvider>
	);
}
