import * as React from 'react';
import { useVideoDom } from './video-dom.context';

export default function useCaptions() {
	const [captions, setCaptions] = React.useState(true);
	const { videoRef } = useVideoDom();

	return React.useMemo(
		() => ({
			captions,
			onToggleCaptions: () => {
				if (videoRef) {
					videoRef.textTracks[0].mode = videoRef.textTracks[0].mode === 'showing' ? 'hidden' : 'showing';
					setCaptions(videoRef.textTracks[0].mode === 'showing');
				}
			},
		}),
		[captions, videoRef]
	);
}
