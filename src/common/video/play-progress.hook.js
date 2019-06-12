import * as React from 'react';
import { useVideoDom } from './video-dom.context';

export default function usePlayProgress({ onTimeUpdate }) {
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		const onLoadStart = () => {
			onTimeUpdate(0);
		};
		const onTimeUpdateInner = () => {
			onTimeUpdate(videoRef.currentTime);
		};

		if (videoRef) {
			videoRef.addEventListener('loadstart', onLoadStart);
			videoRef.addEventListener('timeupdate', onTimeUpdateInner);
		}

		return () => {
			if (videoRef) {
				videoRef.removeEventListener('loadstart', onLoadStart);
				videoRef.removeEventListener('timeupdate', onTimeUpdateInner);
			}
		};
	}, [videoRef, onTimeUpdate]);

	return React.useMemo(
		() => ({
			onSeek: pos => {
				if (videoRef) videoRef.currentTime = pos * videoRef.duration;
			},
		}),
		[videoRef]
	);
}
