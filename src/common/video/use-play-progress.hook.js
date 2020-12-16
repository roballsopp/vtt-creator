import * as React from 'react';
import { useVideoDom } from './video-dom.context';

export default function usePlayProgress({ onTimeUpdate } = {}) {
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		if (!onTimeUpdate || !videoRef) return;

		const onLoadStart = () => {
			onTimeUpdate(0);
		};
		const onTimeUpdateInner = () => {
			onTimeUpdate(videoRef.currentTime);
		};

		// if a component using this hook unmounts, we want to fire current time again when it remounts
		onTimeUpdate(videoRef.currentTime);
		videoRef.addEventListener('loadstart', onLoadStart);
		videoRef.addEventListener('timeupdate', onTimeUpdateInner);

		return () => {
			videoRef.removeEventListener('loadstart', onLoadStart);
			videoRef.removeEventListener('timeupdate', onTimeUpdateInner);
		};
	}, [videoRef, onTimeUpdate]);

	return React.useMemo(
		() => ({
			onSeek: pos => {
				const clipped = Math.min(Math.max(pos, 0), 1);
				if (videoRef) videoRef.currentTime = clipped * videoRef.duration;
			},
			handleNudge: delta => {
				if (videoRef) {
					videoRef.currentTime = Math.min(Math.max(videoRef.currentTime + delta, 0), videoRef.duration);
				}
			},
		}),
		[videoRef]
	);
}
