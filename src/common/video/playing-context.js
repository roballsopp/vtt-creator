import React from 'react';
import PropTypes from 'prop-types';
import { useVideoDom } from './video-dom.context';

const PlayingContext = React.createContext({
	playing: false,
});

PlayingProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function PlayingProvider({ children }) {
	const [playing, setPlaying] = React.useState(true);
	usePlayEvent(setPlaying);
	return (
		<PlayingContext.Provider value={React.useMemo(() => ({ playing }), [playing])}>{children}</PlayingContext.Provider>
	);
}

export function usePlayEvent(handlePlayChange) {
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		if (!videoRef) return;

		handlePlayChange(!videoRef.paused && !videoRef.ended);

		const handlePlay = () => handlePlayChange(true);
		const handlePaused = () => handlePlayChange(false);
		const handleLoadStart = () => handlePlayChange(false);

		videoRef.addEventListener('play', handlePlay);
		videoRef.addEventListener('pause', handlePaused);
		videoRef.addEventListener('loadstart', handleLoadStart);

		return () => {
			videoRef.removeEventListener('play', handlePlay);
			videoRef.removeEventListener('pause', handlePaused);
			videoRef.removeEventListener('loadstart', handleLoadStart);
		};
	}, [handlePlayChange, videoRef]);
}

export function usePlaying() {
	return React.useContext(PlayingContext);
}
