import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import VttTimeline from '../vtt-timeline';
import { FixedAspectRatio } from '../common';
import { CaptionsProvider, FullscreenProvider, OverlayProvider, PlayProvider, VolumeProvider } from '../common/video';
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
		<CaptionsProvider>
			<FullscreenProvider>
				<PlayProvider>
					<OverlayProvider>
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
					</OverlayProvider>
				</PlayProvider>
			</FullscreenProvider>
		</CaptionsProvider>
	);
}
