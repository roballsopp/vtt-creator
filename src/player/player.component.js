import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import VttTimeline from '../vtt-timeline';
import { FixedAspectRatio } from '../common';
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
import { PlayerDurationProvider } from './player-duration.context';
import Video from './video.component';

const useStyles = makeStyles({
	root: {
		display: 'flex',
		flexDirection: 'column',
		height: '100%',
	},
	video: {
		display: 'flex',
		justifyContent: 'center',
		flex: 1,
		backgroundColor: 'black',
	},
	vttTimeline: {
		flex: 1,
		maxHeight: 300,
	},
});

export default function Player() {
	const classes = useStyles();

	return (
		<VideoDomProvider>
			<CaptionsProvider>
				<DurationProvider>
					<PlayerDurationProvider>
						<FullscreenProvider>
							<OverlayProvider>
								<PlayProvider>
									<PlayProgressProvider>
										<VolumeProvider>
											<div className={classes.root}>
												<div className={classes.video}>
													<FixedAspectRatio ratio="16:9">
														<Video />
													</FixedAspectRatio>
												</div>
												<div className={classes.vttTimeline}>
													<VttTimeline />
												</div>
											</div>
										</VolumeProvider>
									</PlayProgressProvider>
								</PlayProvider>
							</OverlayProvider>
						</FullscreenProvider>
					</PlayerDurationProvider>
				</DurationProvider>
			</CaptionsProvider>
		</VideoDomProvider>
	);
}
