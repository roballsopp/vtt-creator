import * as React from 'react';
import { useVideoDom } from './video-dom.context';

export default function useFullscreen({ onFullscreenChange } = {}) {
	const { videoContainerRef } = useVideoDom();

	React.useEffect(() => {
		if (!onFullscreenChange) return;

		const onFullscreenChangeInner = () => onFullscreenChange(!!(document.fullScreen || document.fullscreenElement));
		const onWebkitFullscreenChangeInner = () => onFullscreenChange(!!document.webkitIsFullScreen);
		const onMozFullscreenChangeInner = () => onFullscreenChange(!!document.mozFullScreen);
		const onMsFullscreenChangeInner = () => onFullscreenChange(!!document.msFullscreenElement);

		document.addEventListener('fullscreenchange', onFullscreenChangeInner);
		document.addEventListener('webkitfullscreenchange', onWebkitFullscreenChangeInner);
		document.addEventListener('mozfullscreenchange', onMozFullscreenChangeInner);
		document.addEventListener('msfullscreenchange', onMsFullscreenChangeInner);

		return () => {
			document.removeEventListener('fullscreenchange', onFullscreenChangeInner);
			document.removeEventListener('webkitfullscreenchange', onWebkitFullscreenChangeInner);
			document.removeEventListener('mozfullscreenchange', onMozFullscreenChangeInner);
			document.removeEventListener('msfullscreenchange', onMsFullscreenChangeInner);
		};
	}, [onFullscreenChange]);

	return React.useMemo(
		() => ({
			onToggleFullscreen: () => {
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
			},
		}),
		[videoContainerRef]
	);
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
