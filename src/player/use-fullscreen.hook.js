import * as React from 'react';

export default function useFullscreen(fullscreenContainer) {
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

	return [
		fullscreen,
		React.useCallback(() => {
			if (isFullScreen()) {
				if (document.exitFullscreen) document.exitFullscreen();
				else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
				else if (document.webkitCancelFullScreen) document.webkitCancelFullScreen();
				else if (document.msExitFullscreen) document.msExitFullscreen();
			} else {
				if (!fullscreenContainer) return;
				if (fullscreenContainer.requestFullscreen) fullscreenContainer.requestFullscreen();
				else if (fullscreenContainer.mozRequestFullScreen) fullscreenContainer.mozRequestFullScreen();
				else if (fullscreenContainer.webkitRequestFullScreen) fullscreenContainer.webkitRequestFullScreen();
				else if (fullscreenContainer.msRequestFullscreen) fullscreenContainer.msRequestFullscreen();
			}
		}, [fullscreenContainer]),
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
