import { OverlayProvider, useOverlay } from './overlay.context';
import useCaptions from './use-captions.hook';
import useDuration from './use-duration.hook';
import useFullscreen, { isFullScreenEnabled } from './use-fullscreen.hook';
import usePlay from './use-play.hook';
import usePlayProgress from './use-play-progress.hook';
import useVolume from './use-volume.hook';
import { VideoDomProvider, useVideoDom } from './video-dom.context';
import Video from './video.component';
import { KeyboardControlProvider, useKeyboardControl } from './keyboard-control.context';
import { VideoControlProvider, useVideoControl } from './video-control-context';

export {
	isFullScreenEnabled,
	OverlayProvider,
	KeyboardControlProvider,
	useKeyboardControl,
	useCaptions,
	useDuration,
	useFullscreen,
	useOverlay,
	usePlay,
	usePlayProgress,
	useVideoDom,
	useVolume,
	VideoDomProvider,
	Video,
	VideoControlProvider,
	useVideoControl,
};
