import Tooltip from '@material-ui/core/Tooltip';
import React from 'react';
import { usePlayTime } from './play-time-context';
import { useDuration } from './duration-context';

export function PlayTime({ className }) {
	const { playtime } = usePlayTime();
	return (
		<div className={className}>
			<Tooltip title="Current Time">
				<span>{formatSeconds(playtime)}</span>
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
