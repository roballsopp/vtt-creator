import * as React from 'react';
import * as PropTypes from 'prop-types';
import useFullscreen from './use-fullscreen.hook';

const VideoControlsContext = React.createContext({});

VideoControlsProvider.propTypes = {
	videoRef: PropTypes.instanceOf(HTMLVideoElement),
	videoContainerRef: PropTypes.instanceOf(HTMLElement),
	children: PropTypes.node,
};

export function VideoControlsProvider({ videoRef, videoContainerRef, children }) {
	const [duration, setDuration] = React.useState();
	const [currentTime, setCurrentTime] = React.useState();
	const [volume, setVolume] = React.useState(1);
	const [muted, setMuted] = React.useState(false);
	const [paused, setPaused] = React.useState(true);

	const [fullscreen, onToggleFullscreen] = useFullscreen(videoContainerRef);

	React.useEffect(() => {
		const onLoadedMeta = () => setDuration(videoRef.duration);
		const onTimeUpdate = () => {
			if (!duration) setDuration(videoRef.duration); // sometimes needed (https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player#Progress)
			setCurrentTime(videoRef.currentTime);
		};
		const onPlay = () => setPaused(false);
		const onPaused = () => setPaused(true);

		if (videoRef) {
			videoRef.addEventListener('loadedmetadata', onLoadedMeta);
			videoRef.addEventListener('timeupdate', onTimeUpdate);
			videoRef.addEventListener('play', onPlay);
			videoRef.addEventListener('pause', onPaused);
		}

		return () => {
			if (videoRef) {
				videoRef.removeEventListener('loadedmetadata', onLoadedMeta);
				videoRef.removeEventListener('timeupdate', onTimeUpdate);
				videoRef.removeEventListener('pause', onPaused);
			}
		};
	}, [videoRef, duration]);

	const onPlayPause = React.useCallback(() => {
		if (videoRef.paused || videoRef.ended) videoRef.play();
		else videoRef.pause();
	}, [videoRef]);

	const onVolumeChange = React.useCallback(
		volume => {
			setVolume(volume);
			if (videoRef) videoRef.volume = volume;
		},
		[videoRef]
	);

	const onToggleMute = React.useCallback(() => {
		setMuted(!videoRef.muted);
		if (videoRef) videoRef.muted = !videoRef.muted;
	}, [videoRef]);

	return (
		<VideoControlsContext.Provider
			value={{
				duration,
				currentTime,
				paused,
				fullscreen,
				volume,
				muted,
				onPlayPause,
				onToggleFullscreen,
				onVolumeChange,
				onToggleMute,
			}}>
			{children}
		</VideoControlsContext.Provider>
	);
}

export function useVideoEvents() {
	return React.useContext(VideoControlsContext);
}
