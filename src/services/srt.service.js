// type CueList = Array<VTTCue>;
export function getSRTFromCues(cueList) {
	const srtParts = cueList.map((nextCue, i) => {
		const start = formatSeconds(nextCue.startTime);
		const end = formatSeconds(nextCue.endTime);
		return `${i + 1}\n${start} --> ${end}\n${nextCue.text}\n\n`;
	});

	return new Blob(srtParts, { type: 'text/srt' });
}

// decSeconds is a float version of the time in seconds (e.g. 13.456)
export function formatSeconds(decSeconds) {
	if (isNaN(decSeconds)) return '00:00:00,000';
	const hrs = Math.floor(decSeconds / 3600);
	const min = Math.floor((decSeconds % 3600) / 60);
	const sec = Math.floor(decSeconds % 60);
	const mill = Math.round((decSeconds - Math.floor(decSeconds)) * 1000);
	return `${formatTimeUnit(hrs, 2)}:${formatTimeUnit(min, 2)}:${formatTimeUnit(sec, 2)},${formatTimeUnit(mill, 3)}`;
}

function formatTimeUnit(unit, width) {
	if (!unit) return '0'.repeat(width);
	return unit.toString().padStart(width, '0');
}
