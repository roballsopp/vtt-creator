import React from 'react';
import PropTypes from 'prop-types';
import { useVideoDom } from './video-dom.context';

const PlayTimeContext = React.createContext({
	playtime: 0,
});

PlayTimeProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function PlayTimeProvider({ children }) {
	const [playtime, setPlayTime] = React.useState(0);
	usePlayTimeEvent(setPlayTime);
	return (
		<PlayTimeContext.Provider value={React.useMemo(() => ({ playtime }), [playtime])}>{children}</PlayTimeContext.Provider>
	);
}

export function usePlayTimeEvent(handlePlayTimeChange) {
	const { videoRef } = useVideoDom();

	React.useEffect(() => {
		if (!videoRef) return;

		const handleLoadStart = () => {
			handlePlayTimeChange(0);
		};
		const _handlePlayTimeChange = () => {
			handlePlayTimeChange(videoRef.currentTime);
		};

		// if a component using this hook unmounts, we want to fire current time again when it remounts
		handlePlayTimeChange(videoRef.currentTime);
		videoRef.addEventListener('loadstart', handleLoadStart);
		videoRef.addEventListener('timeupdate', _handlePlayTimeChange);

		return () => {
			videoRef.removeEventListener('loadstart', handleLoadStart);
			videoRef.removeEventListener('timeupdate', _handlePlayTimeChange);
		};
	}, [videoRef, handlePlayTimeChange]);
}

export function usePlayTime() {
	return React.useContext(PlayTimeContext);
}
