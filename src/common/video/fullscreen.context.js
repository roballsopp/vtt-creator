import * as React from 'react';
import * as PropTypes from 'prop-types';
import { useVideoDom } from './video-dom.context';

const FullscreenContext = React.createContext({});

FullscreenProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function FullscreenProvider({ children }) {
	const { videoContainerRef } = useVideoDom();

	const [fullscreen, setFullscreen] = React.useState(false);

	React.useEffect(() => {
		const onFullscreenChange = () => setFullscreen(!!(document.fullScreen || document.fullscreenElement));
		const onWebkitFullscreenChange = () => setFullscreen(!!document.webkitIsFullScreen);
		const onMozFullscreenChange = () => setFullscreen(!!document.mozFullScreen);
		const onMsFullscreenChange = () => setFullscreen(!!document.msFullscreenElement);

		document.addEventListener('fullscreenchange', onFullscreenChange);
		document.addEventListener('webkitfullscreenchange', onWebkitFullscreenChange);
		document.addEventListener('mozfullscreenchange', onMozFullscreenChange);
		document.addEventListener('msfullscreenchange', onMsFullscreenChange);

		return () => {
			document.removeEventListener('fullscreenchange', onFullscreenChange);
			document.removeEventListener('webkitfullscreenchange', onWebkitFullscreenChange);
			document.removeEventListener('mozfullscreenchange', onMozFullscreenChange);
			document.removeEventListener('msfullscreenchange', onMsFullscreenChange);
		};
	}, []);

	const onToggleFullscreen = React.useCallback(() => {
		if (isFullScreen()) {
			if (document.exitFullscreen) document.exitFullscreen();
			else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
			else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
			else if (document.msExitFullscreen) document.msExitFullscreen();
		} else {
			if (!videoContainerRef) return;
			if (videoContainerRef.requestFullscreen) videoContainerRef.requestFullscreen();
			else if (videoContainerRef.mozRequestFullScreen) videoContainerRef.mozRequestFullScreen();
			else if (videoContainerRef.webkitRequestFullScreen) videoContainerRef.webkitRequestFullScreen();
			else if (videoContainerRef.msRequestFullscreen) videoContainerRef.msRequestFullscreen();
		}
	}, [videoContainerRef]);

	return (
		<FullscreenContext.Provider
			value={{
				fullscreen,
				onToggleFullscreen,
			}}>
			{children}
		</FullscreenContext.Provider>
	);
}

export function useFullscreen() {
	return React.useContext(FullscreenContext);
}

function isFullScreen() {
	return !!(
		document.fullScreen ||
		document.webkitIsFullScreen ||
		document.mozFullScreen ||
		document.msFullscreenElement ||
		document.fullscreenElement
	);
}

export const isFullScreenEnabled = () =>
	!!(
		document.fullscreenEnabled ||
		document.mozFullScreenEnabled ||
		document.msFullscreenEnabled ||
		document.webkitSupportsFullscreen ||
		document.webkitFullscreenEnabled ||
		document.createElement('video').webkitRequestFullScreen
	);
