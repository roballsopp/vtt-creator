import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import CueTrack from './cue-track.component';
import AudioTrack from './audio-track.component';
import ZoomContainer from './zoom-container.component';
import TimeTicks from './time-ticks.component';

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
		backgroundColor: theme.palette.grey['700'],
	},
	ticks: {
		height: 20,
		boxShadow: '0 1px 5px rgba(0, 0, 0, 0.3)',
	},
	trackRoot: {
		position: 'relative',
		flex: 1,
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
				<div className={classes.ticks}>
					<TimeTicks />
				</div>
				<div className={classes.trackRoot}>
					<AudioTrack />
					<div className={classes.cueTrack}>
						<CueTrack />
					</div>
				</div>
			</div>
		</ZoomContainer>
	);
}
