import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useVideoDom } from './video-dom.context';

const PlayProgressContext = React.createContext({});

PlayProgressProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function PlayProgressProvider({ children }) {
	const [currentTime, setCurrentTime] = React.useState();
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		const onLoadStart = () => {
			setCurrentTime(0);
		};
		const onTimeUpdate = () => {
			setCurrentTime(videoRef.currentTime);
		};

		if (videoRef) {
			videoRef.addEventListener('loadstart', onLoadStart);
			videoRef.addEventListener('timeupdate', onTimeUpdate);
		}

		return () => {
			if (videoRef) {
				videoRef.removeEventListener('loadstart', onLoadStart);
				videoRef.removeEventListener('timeupdate', onTimeUpdate);
			}
		};
	}, [videoRef]);

	const onSeek = React.useCallback(
		pos => {
			if (videoRef) videoRef.currentTime = pos * videoRef.duration;
		},
		[videoRef]
	);

	return (
		<PlayProgressContext.Provider
			value={{
				currentTime,
				onSeek,
			}}>
			{children}
		</PlayProgressContext.Provider>
	);
}

export function usePlayProgress() {
	return React.useContext(PlayProgressContext);
}
