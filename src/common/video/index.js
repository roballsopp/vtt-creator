import { CaptionsProvider, useCaptions } from './captions.context';
import { DurationProvider, useDuration } from './duration.context';
import { FullscreenProvider, useFullscreen, isFullScreenEnabled } from './fullscreen.context';
import { OverlayProvider, useOverlay } from './overlay.context';
import { PlayProvider, usePlay } from './play.context';
import { PlayProgressProvider, usePlayProgress } from './play-progress.context';
import { VideoDomProvider, useVideoDom } from './video-dom.context';
import { VolumeProvider, useVolume } from './volume.context';
import Video from './video.component';

export {
	CaptionsProvider,
	DurationProvider,
	FullscreenProvider,
	OverlayProvider,
	PlayProvider,
	PlayProgressProvider,
	VideoDomProvider,
	VolumeProvider,
	useCaptions,
	useDuration,
	useFullscreen,
	useOverlay,
	usePlay,
	usePlayProgress,
	useVideoDom,
	useVolume,
	isFullScreenEnabled,
	Video,
};
