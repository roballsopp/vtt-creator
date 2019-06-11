import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import CueTrack from './cue-track.component';
import AudioTrack from './audio-track.component';
import ZoomContainer from './zoom-container.component';
import TimeTicks from './time-ticks.component';

const useStyles = makeStyles(theme => ({
	root: {
		position: 'relative',
		height: '100%',
		width: '100%',
		backgroundColor: theme.palette.grey['700'],
	},
	cueTrack: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
	timeTicks: {
		position: 'absolute',
		top: 0,
		left: 0,
	},
}));

VttTimeline.propTypes = {};

export default function VttTimeline() {
	const classes = useStyles();

	return (
		<ZoomContainer>
			<div className={classes.root}>
				<AudioTrack />
				<div className={classes.cueTrack}>
					<CueTrack />
				</div>
				<div className={classes.timeTicks}>
					<TimeTicks />
				</div>
			</div>
		</ZoomContainer>
	);
}
