import * as React from 'react';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import PauseIcon from '@material-ui/icons/Pause';
import PlayIcon from '@material-ui/icons/PlayArrow';
import CaptionsIcon from '@material-ui/icons/ClosedCaption';
import { makeStyles } from '@material-ui/styles';
import useFullscreen, { isFullScreenEnabled } from './use-fullscreen.hook';
import usePlay from './use-play.hook';
import useCaptions from './use-captions.hook';
import IconToggle from './icon-toggle.component';
import VolumeInput from './volume-input.component';
import PlayProgress from './play-progress.component';
import PlayTime from './play-time.component';

const useStyles = makeStyles({
	controlBar: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'spaceBetween',
		marginBottom: 4,
		padding: '0 12px',
	},
	controlGroupLeft: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
	},
	controlLeft: {
		marginRight: 4,
	},
	controlGroupRight: {
		flex: 1,
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'flex-end',
	},
	controlRight: {
		marginLeft: 4,
	},
});

export default function VideoControls(props) {
	const [paused, onPlayPause] = React.useState(true);
	const [fullscreen, onFullscreenChange] = React.useState(false);
	const { onTogglePlay } = usePlay({ onPlayPause });
	const { onToggleFullscreen } = useFullscreen({ onFullscreenChange });
	const { onToggleCaptions } = useCaptions();

	const classes = useStyles();
	return (
		<div {...props}>
			<div className={classes.controlBar}>
				<div className={classes.controlGroupLeft}>
					<div className={classes.controlLeft}>
						<IconToggle
							on={paused}
							onIcon={<PlayIcon />}
							offIcon={<PauseIcon />}
							aria-label="Play/Pause"
							size="small"
							color="inherit"
							edge="start"
							onToggle={onTogglePlay}
						/>
					</div>
					<div className={classes.controlLeft}>
						<PlayTime />
					</div>
				</div>
				<div className={classes.controlGroupRight}>
					<div className={classes.controlRight}>
						<VolumeInput />
					</div>
					{isFullScreenEnabled() && (
						<div className={classes.controlRight}>
							<IconToggle
								on={fullscreen}
								onIcon={<FullscreenExitIcon />}
								offIcon={<FullscreenIcon />}
								aria-label="Toggle fullscreen"
								size="small"
								color="inherit"
								onToggle={onToggleFullscreen}
							/>
						</div>
					)}
					<div className={classes.controlRight}>
						<IconToggle
							on
							onIcon={<CaptionsIcon />}
							aria-label="Toggle captions"
							size="small"
							color="inherit"
							onToggle={onToggleCaptions}
						/>
					</div>
				</div>
			</div>
			<PlayProgress />
		</div>
	);
}
