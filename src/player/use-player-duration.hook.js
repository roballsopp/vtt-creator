import * as React from 'react';
import { useDuration } from '../common/video';
import { useCues } from '../common';

export default function usePlayerDuration({ onDurationChange }) {
	const { cues } = useCues();
	const [videoDuration, setVideoDuration] = React.useState(0);

	useDuration({
		onDurationChange: React.useCallback(
			duration => {
				setVideoDuration(duration);
				onDurationChange(duration);
			},
			[onDurationChange]
		),
	});

	React.useEffect(() => {
		if (videoDuration) return;

		if (cues && cues.length) {
			onDurationChange(cues[cues.length - 1].endTime);
		}
	}, [cues, onDurationChange, videoDuration]);
}
