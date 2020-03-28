import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
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
		justifyContent: 'center',
		flex: 1,
		backgroundColor: 'black',
		minHeight: 0,
		minWidth: 0,
	},
	video: {
		height: '100%',
		maxWidth: 1000,
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
				</div>
				<div className={classes.vttTimeline}>
					<VttTimeline />
				</div>
			</div>
		</OverlayProvider>
	);
}
