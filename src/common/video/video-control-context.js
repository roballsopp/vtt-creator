import React from 'react';
import PropTypes from 'prop-types';
import { useVideoDom } from './video-dom.context';

const VideoControlContext = React.createContext({
	togglePlay: () => {},
	seeking: false,
	seekVideo: () => {},
	nudgeVideo: () => {},
});

VideoControlProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function VideoControlProvider({ children }) {
	const { videoRef } = useVideoDom();
	const [seeking, setSeeking] = React.useState(false);
	const playPromiseRef = React.useRef(Promise.resolve());

	React.useEffect(() => {
		if (!videoRef) return;

		const handleTimeUpdate = () => {
			setSeeking(false);
		};

		videoRef.addEventListener('timeupdate', handleTimeUpdate);

		return () => {
			videoRef.removeEventListener('timeupdate', handleTimeUpdate);
		};
	}, [videoRef]);

	// play() method is actually asynchronous and you'll get fun error messages if you try to pause before play has resolved:
	// https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
	const togglePlay = React.useCallback(() => {
		if (!videoRef) return;
		return playPromiseRef.current.then(() => {
			if (videoRef.paused || videoRef.ended) return videoRef.play();
			else videoRef.pause();
		});
	}, [videoRef]);

	const seekVideo = React.useCallback(
		pos => {
			const clipped = Math.min(Math.max(pos, 0), 1);
			if (videoRef) {
				setSeeking(true);
				videoRef.currentTime = clipped * videoRef.duration;
			}
		},
		[videoRef]
	);

	const nudgeVideo = React.useCallback(
		delta => {
			if (videoRef) {
				setSeeking(true);
				videoRef.currentTime = Math.min(Math.max(videoRef.currentTime + delta, 0), videoRef.duration);
			}
		},
		[videoRef]
	);

	return (
		<VideoControlContext.Provider
			value={React.useMemo(
				() => ({
					togglePlay,
					seeking,
					seekVideo,
					nudgeVideo,
				}),
				[togglePlay, seeking, seekVideo, nudgeVideo]
			)}>
			{children}
		</VideoControlContext.Provider>
	);
}

export function useVideoControl() {
	return React.useContext(VideoControlContext);
}
