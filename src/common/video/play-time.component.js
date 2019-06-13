import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import usePlayProgress from './use-play-progress.hook';
import useDuration from './use-duration.hook';

export default function PlayTime() {
	const [currentTime, onTimeUpdate] = React.useState(0);
	usePlayProgress({ onTimeUpdate });
	const { duration } = useDuration();
	return (
		<Typography variant="subtitle2">
			{formatSeconds(currentTime)} / {formatSeconds(duration)}
		</Typography>
	);
}

function formatSeconds(decSeconds) {
	if (isNaN(decSeconds)) return '0:00';
	const min = Math.floor(decSeconds / 60);
	const sec = Math.floor(decSeconds % 60);
	return `${min}:${formatTimeUnit(sec, 2)}`;
}

function formatTimeUnit(unit, width) {
	if (!unit) return '0'.repeat(width);
	return unit.toString().padStart(width, '0');
}
