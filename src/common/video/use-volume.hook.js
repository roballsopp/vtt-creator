import * as React from 'react';
import { useVideoDom } from './video-dom.context';

export default function useVolume() {
	const [volume, setVolume] = React.useState(1);
	const [muted, setMuted] = React.useState(false);
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		if (!videoRef) return;

		setVolume(videoRef.volume);
		setMuted(videoRef.muted);

		// when a new video loads, set its volume and mute status to whatever the old video was set to
		const onLoadStart = () => {
			videoRef.volume = volume; // TODO: check that this works
			videoRef.muted = muted;
		};

		const onVolumeChange = () => {
			setVolume(videoRef.volume);
			setMuted(videoRef.muted);
		};

		videoRef.addEventListener('loadstart', onLoadStart);
		videoRef.addEventListener('volumechange', onVolumeChange);

		return () => {
			videoRef.removeEventListener('loadstart', onLoadStart);
			videoRef.removeEventListener('volumechange', onVolumeChange);
		};
	}, [muted, volume, videoRef]);

	return React.useMemo(
		() => ({
			volume,
			muted,
			onVolumeChange: volume => {
				if (videoRef) videoRef.volume = volume;
			},
			onToggleMute: () => {
				if (videoRef) videoRef.muted = !videoRef.muted;
			},
		}),
		[volume, muted, videoRef]
	);
}
