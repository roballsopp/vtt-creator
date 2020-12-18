import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import usePlayProgress from './use-play-progress.hook';
import useDuration from './use-duration.hook';

export function PlayTime({ className }) {
	const [currentTime, onTimeUpdate] = React.useState(0);
	usePlayProgress({ onTimeUpdate });
	return (
		<div className={className}>
			<Tooltip title="Current Time">
				<span>{formatSeconds(currentTime)}</span>
			</Tooltip>
		</div>
	);
}

export function PlayDuration({ className }) {
	const { duration } = useDuration();
	return (
		<div className={className}>
			<Tooltip title="Video Duration">
				<span>{formatSeconds(duration)}</span>
			</Tooltip>
		</div>
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
