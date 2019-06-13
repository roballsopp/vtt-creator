import * as React from 'react';
import { useVideoDom } from './video-dom.context';

export default function useDuration({ onDurationChange }) {
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		const onDurationChangeInner = () => {
			onDurationChange(videoRef.duration);
		};

		if (videoRef) {
			// if a component using this hook unmounts, we want to fire duration again when it remounts
			onDurationChange(videoRef.duration);
			videoRef.addEventListener('durationchange', onDurationChangeInner);
		}

		return () => {
			if (videoRef) {
				videoRef.removeEventListener('durationchange', onDurationChangeInner);
			}
		};
	}, [videoRef, onDurationChange]);
}
