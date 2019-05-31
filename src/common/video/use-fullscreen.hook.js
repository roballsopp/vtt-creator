import * as React from 'react';

export default function useFullscreen(fullscreenContainer) {
	const setFullscreenData = React.useCallback(
		state => {
			if (fullscreenContainer) fullscreenContainer.setAttribute('data-fullscreen', !!state);
		},
		[fullscreenContainer]
	);

	React.useEffect(() => {
		const onFullscreenChange = () => setFullscreenData(!!(document.fullScreen || document.fullscreenElement));
		const onWebkitFullscreenChange = () => setFullscreenData(!!document.webkitIsFullScreen);
		const onMozFullscreenChange = () => setFullscreenData(!!document.mozFullScreen);
		const onMsFullscreenChange = () => setFullscreenData(!!document.msFullscreenElement);

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
	}, [setFullscreenData]);

	return [
		isFullScreen(),
		React.useCallback(() => {
			if (isFullScreen()) {
				if (document.exitFullscreen) document.exitFullscreen();
				else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
				else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
				else if (document.msExitFullscreen) document.msExitFullscreen();
				setFullscreenData(false);
			} else {
				if (!fullscreenContainer) return;
				if (fullscreenContainer.requestFullscreen) fullscreenContainer.requestFullscreen();
				else if (fullscreenContainer.mozRequestFullScreen) fullscreenContainer.mozRequestFullScreen();
				else if (fullscreenContainer.webkitRequestFullScreen) fullscreenContainer.webkitRequestFullScreen();
				else if (fullscreenContainer.msRequestFullscreen) fullscreenContainer.msRequestFullscreen();
				setFullscreenData(true);
			}
		}, [fullscreenContainer, setFullscreenData]),
	];
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
