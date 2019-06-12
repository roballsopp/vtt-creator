import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useVideoDom } from './video-dom.context';

const PlayContext = React.createContext({});

PlayProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function PlayProvider({ children }) {
	const [paused, setPaused] = React.useState(true);
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		const onPlay = () => setPaused(false);
		const onPaused = () => setPaused(true);
		const onLoadStart = () => setPaused(true);

		if (videoRef) {
			videoRef.addEventListener('play', onPlay);
			videoRef.addEventListener('pause', onPaused);
			videoRef.addEventListener('loadstart', onLoadStart);
		}

		return () => {
			if (videoRef) {
				videoRef.removeEventListener('play', onPlay);
				videoRef.removeEventListener('pause', onPaused);
				videoRef.removeEventListener('loadstart', onLoadStart);
			}
		};
	}, [videoRef]);

	const onPlayPause = React.useCallback(() => {
		if (videoRef.paused || videoRef.ended) videoRef.play();
		else videoRef.pause();
	}, [videoRef]);

	return (
		<PlayContext.Provider
			value={{
				paused,
				onPlayPause,
			}}>
			{children}
		</PlayContext.Provider>
	);
}

export function usePlay() {
	return React.useContext(PlayContext);
}
