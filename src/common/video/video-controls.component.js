import React from 'react';
import PropTypes from 'prop-types';
import Tooltip from '@material-ui/core/Tooltip';
import { createMuiTheme, ThemeProvider as MuiThemeProvider } from '@material-ui/core/styles';
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
import { useVideoDom } from './video-dom.context';
import VolumeInput from './volume-input.component';
import PlayProgress from './play-progress.component';
import { PlayTime, PlayDuration } from './play-time.component';
import PlaySpeed from './play-speed.component';

const createControlsTheme = outer => {
	return createMuiTheme({
		...outer,
		palette: {
			...outer.palette,
			text: {
				...outer.palette.text,
				default: 'rgba(255,255,255,1.0)',
				disabled: 'rgba(255,255,255,0.38)',
			},
			action: {
				...outer.palette.action,
				active: 'rgba(255,255,255,1.0)',
				disabled: 'rgba(255,255,255,0.38)',
			},
		},
	});
};

const useStyles = makeStyles(theme => ({
	controlBar: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 8),
	},
	controlLeft: {
		marginRight: theme.spacing(1),
	},
	controlRight: {
		marginLeft: theme.spacing(1),
	},
	playDuration: {
		marginLeft: theme.spacing(1),
		marginRight: 10,
	},
}));

VideoControls.propTypes = {
	className: PropTypes.any,
};

export default function VideoControls({ className }) {
	const { videoRef } = useVideoDom();
	const [paused, onPlayPause] = React.useState(true);
	const { onTogglePlay } = usePlay({ onPlayPause });
	const { fullscreen, onToggleFullscreen } = useFullscreen();
	const { onToggleCaptions } = useCaptions();
	const disabled = !videoRef;

	const classes = useStyles();
	return (
		<MuiThemeProvider theme={createControlsTheme}>
			<div className={className}>
				<div className={classes.controlBar}>
					<div className={classes.controlLeft}>
						<IconToggle
							on={paused}
							onIcon={<PlayIcon />}
							offIcon={<PauseIcon />}
							disabled={disabled}
							color="default"
							aria-label="Play/Pause"
							size="small"
							edge="start"
							onToggle={onTogglePlay}
						/>
					</div>
					<div className={classes.controlLeft}>
						<PlayTime />
					</div>
					<PlayProgress disabled={disabled} />
					<div className={classes.playDuration}>
						<PlayDuration />
					</div>
					<div className={classes.controlRight}>
						<VolumeInput disabled={disabled} />
					</div>
					{isFullScreenEnabled() && (
						<div className={classes.controlRight}>
							<Tooltip title="Toggle Full Screen">
								<span>
									<IconToggle
										on={fullscreen}
										onIcon={<FullscreenExitIcon />}
										offIcon={<FullscreenIcon />}
										disabled={disabled}
										aria-label="Toggle fullscreen"
										size="small"
										onToggle={onToggleFullscreen}
									/>
								</span>
							</Tooltip>
						</div>
					)}
					<div className={classes.controlRight}>
						<Tooltip title="Hide/Show Captions">
							<span>
								<IconToggle
									on
									onIcon={<CaptionsIcon />}
									disabled={disabled}
									aria-label="Toggle captions"
									size="small"
									onToggle={onToggleCaptions}
								/>
							</span>
						</Tooltip>
					</div>
					<div className={classes.controlRight}>
						<PlaySpeed disabled={disabled} />
					</div>
				</div>
			</div>
		</MuiThemeProvider>
	);
}
