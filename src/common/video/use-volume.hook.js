import * as React from 'react';
import { useVideoDom } from './video-dom.context';

export default function useVolume({ onVolumeChange }) {
	const [volume, setVolume] = React.useState(1);
	const [muted, setMuted] = React.useState(false);
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		if (!onVolumeChange || !videoRef) return;

		onVolumeChange(videoRef.volume, videoRef.muted);

		// when a new video loads, set its volume and mute status to whatever the old video was set to
		const onLoadStart = () => {
			onVolumeChange(volume, muted); // TODO: check that this works
		};

		const onVolumeChangeInner = () => {
			setVolume(videoRef.volume);
			setMuted(videoRef.muted);
			onVolumeChange(videoRef.volume, videoRef.muted);
		};

		videoRef.addEventListener('loadstart', onLoadStart);
		videoRef.addEventListener('volumechange', onVolumeChangeInner);

		return () => {
			videoRef.removeEventListener('loadstart', onLoadStart);
			videoRef.removeEventListener('volumechange', onVolumeChangeInner);
		};
	}, [muted, volume, onVolumeChange, videoRef]);

	return React.useMemo(
		() => ({
			onVolumeChange: volume => {
				if (videoRef) videoRef.volume = volume;
			},
			onToggleMute: () => {
				if (videoRef) videoRef.muted = !videoRef.muted;
			},
		}),
		[videoRef]
	);
}
