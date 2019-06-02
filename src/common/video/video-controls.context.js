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
	const [captions, setCaptions] = React.useState(true);

	const [fullscreen, onToggleFullscreen] = useFullscreen(videoContainerRef);

	React.useEffect(() => {
		const onLoadedMeta = () => setDuration(videoRef.duration);
		const onTimeUpdate = () => {
			if (!duration) setDuration(videoRef.duration); // sometimes needed (https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/cross_browser_video_player#Progress)
			setCurrentTime(videoRef.currentTime);
		};
		const onPlay = () => setPaused(false);
		const onPaused = () => setPaused(true);
		const onVolumeChange = () => setVolume(videoRef.volume);

		if (videoRef) {
			videoRef.addEventListener('loadedmetadata', onLoadedMeta);
			videoRef.addEventListener('timeupdate', onTimeUpdate);
			videoRef.addEventListener('play', onPlay);
			videoRef.addEventListener('pause', onPaused);
			videoRef.addEventListener('volumechange', onVolumeChange);
		}

		return () => {
			if (videoRef) {
				videoRef.removeEventListener('loadedmetadata', onLoadedMeta);
				videoRef.removeEventListener('timeupdate', onTimeUpdate);
				videoRef.removeEventListener('play', onPlay);
				videoRef.removeEventListener('pause', onPaused);
				videoRef.removeEventListener('volumechange', onVolumeChange);
			}
		};
	}, [videoRef, duration]);

	const onPlayPause = React.useCallback(() => {
		if (videoRef.paused || videoRef.ended) videoRef.play();
		else videoRef.pause();
	}, [videoRef]);

	const onSeek = React.useCallback(
		pos => {
			if (videoRef) videoRef.currentTime = pos * videoRef.duration;
		},
		[videoRef]
	);

	const onVolumeChange = React.useCallback(
		volume => {
			if (videoRef) videoRef.volume = volume;
		},
		[videoRef]
	);

	const onToggleMute = React.useCallback(() => {
		if (videoRef) {
			videoRef.muted = !videoRef.muted;
			setMuted(videoRef.muted);
		}
	}, [videoRef]);

	const onToggleCaptions = React.useCallback(() => {
		if (videoRef) {
			videoRef.textTracks[0].mode = videoRef.textTracks[0].mode === 'showing' ? 'hidden' : 'showing';
			setCaptions(videoRef.textTracks[0].mode === 'showing');
		}
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
				captions,
				onPlayPause,
				onSeek,
				onToggleFullscreen,
				onVolumeChange,
				onToggleMute,
				onToggleCaptions,
			}}>
			{children}
		</VideoControlsContext.Provider>
	);
}

export function useVideoEvents() {
	return React.useContext(VideoControlsContext);
}
