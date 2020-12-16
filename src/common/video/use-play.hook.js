import * as React from 'react';
import { useVideoDom } from './video-dom.context';

export default function usePlay({ onPlayPause } = {}) {
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		if (!onPlayPause || !videoRef) return;

		onPlayPause(videoRef.paused || videoRef.ended);
		const onPlay = () => onPlayPause(false);
		const onPaused = () => onPlayPause(true);
		const onLoadStart = () => onPlayPause(true);

		videoRef.addEventListener('play', onPlay);
		videoRef.addEventListener('pause', onPaused);
		videoRef.addEventListener('loadstart', onLoadStart);

		return () => {
			videoRef.removeEventListener('play', onPlay);
			videoRef.removeEventListener('pause', onPaused);
			videoRef.removeEventListener('loadstart', onLoadStart);
		};
	}, [onPlayPause, videoRef]);

	return React.useMemo(
		() => ({
			onTogglePlay: () => {
				if (!videoRef) return;
				if (videoRef.paused || videoRef.ended) videoRef.play();
				else videoRef.pause();
			},
		}),
		[videoRef]
	);
}
