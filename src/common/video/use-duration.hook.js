import * as React from 'react';
import { useVideoDom } from './video-dom.context';

export default function useDuration() {
	const { videoRef } = useVideoDom();
	const [duration, setDuration] = React.useState(0);

	React.useEffect(() => {
		if (!videoRef) return;

		// TODO: figure out why this is necessary. components unmounting and resetting state above to 0?
		setDuration(videoRef.duration);

		const onDurationChange = () => {
			setDuration(videoRef.duration);
		};

		videoRef.addEventListener('durationchange', onDurationChange);

		return () => {
			videoRef.removeEventListener('durationchange', onDurationChange);
		};
	}, [videoRef]);

	return React.useMemo(() => ({ duration }), [duration]);
}
