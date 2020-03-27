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
	video: {
		display: 'flex',
		justifyContent: 'center',
		flex: 1,
		backgroundColor: 'black',
		minHeight: 0,
		minWidth: 0,
	},
	vttTimeline: {
		flex: 1,
		maxHeight: 300,
	},
});

export default function Player() {
	const classes = useStyles();

	return (
		<OverlayProvider>
			<div className={classes.root}>
				<div className={classes.video}>
					<Video />
				</div>
				<div className={classes.vttTimeline}>
					<VttTimeline />
				</div>
			</div>
		</OverlayProvider>
	);
}
