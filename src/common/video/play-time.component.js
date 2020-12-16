import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import Typography from '@material-ui/core/Typography';
import usePlayProgress from './use-play-progress.hook';
import useDuration from './use-duration.hook';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles({
	text: {
		fontSize: 16,
	},
});

export function PlayTime() {
	const [currentTime, onTimeUpdate] = React.useState(0);
	usePlayProgress({ onTimeUpdate });
	const classes = useStyles();
	return (
		<Tooltip title="Current Time">
			<Typography variant="subtitle2" className={classes.text}>
				{formatSeconds(currentTime)}
			</Typography>
		</Tooltip>
	);
}

export function PlayDuration() {
	const classes = useStyles();
	const { duration } = useDuration();
	return (
		<Tooltip title="Video Duration">
			<Typography variant="subtitle2" className={classes.text}>
				{formatSeconds(duration)}
			</Typography>
		</Tooltip>
	);
}

function formatSeconds(decSeconds) {
	if (isNaN(decSeconds)) return '0:00.000';
	const min = Math.floor(decSeconds / 60);
	const sec = Math.floor(decSeconds % 60);
	const mil = Math.round((decSeconds - Math.floor(decSeconds)) * 1000);
	return `${min}:${formatTimeUnit(sec, 2)}.${formatTimeUnit(mil, 3)}`;
}

function formatTimeUnit(unit, width) {
	if (!unit) return '0'.repeat(width);
	return unit.toString().padStart(width, '0');
}
