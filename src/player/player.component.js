import * as React from 'react';
import {
	CaptionsProvider,
	DurationProvider,
	FullscreenProvider,
	OverlayProvider,
	PlayProvider,
	PlayProgressProvider,
	VideoDomProvider,
	VolumeProvider,
} from '../common/video';
import Video from './video.component';

export default function Player() {
	return (
		<VideoDomProvider>
			<CaptionsProvider>
				<DurationProvider>
					<FullscreenProvider>
						<OverlayProvider>
							<PlayProvider>
								<PlayProgressProvider>
									<VolumeProvider>
										<Video />
									</VolumeProvider>
								</PlayProgressProvider>
							</PlayProvider>
						</OverlayProvider>
					</FullscreenProvider>
				</DurationProvider>
			</CaptionsProvider>
		</VideoDomProvider>
	);
}
