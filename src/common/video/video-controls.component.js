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
import { useVideoControl } from './video-control-context';
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
		overrides: {
			...outer.overrides,
			MuiIconButton: {
				root: {
					padding: 4,
					fontSize: '1.5em',
				},
			},
		},
	});
};

const useStyles = makeStyles(theme => ({
	root: {
		display: 'flex',
		alignItems: 'center',
		padding: theme.spacing(0, 8),
		height: 38,
		color: 'white',
		fontSize: 20,
	},
	controlLeft: {
		marginRight: theme.spacing(1),
	},
	controlRight: {
		marginLeft: theme.spacing(1),
	},
	playTime: {
		marginLeft: theme.spacing(3),
		marginRight: theme.spacing(1),
	},
	playDuration: {
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(3),
	},
}));

VideoControls.propTypes = {
	className: PropTypes.any,
};

export default function VideoControls({ className }) {
	const { videoRef } = useVideoDom();
	const [paused, onPlayPause] = React.useState(true);
	const { togglePlay } = useVideoControl();
	const { fullscreen, onToggleFullscreen } = useFullscreen();
	const { onToggleCaptions } = useCaptions();
	const disabled = !videoRef;

	usePlay({ onPlayPause });

	const classes = useStyles();
	return (
		<MuiThemeProvider theme={createControlsTheme}>
			<div className={className}>
				<div className={classes.root}>
					<IconToggle
						on={paused}
						onIcon={<PlayIcon fontSize="inherit" />}
						offIcon={<PauseIcon fontSize="inherit" />}
						disabled={disabled}
						aria-label="Play/Pause"
						onToggle={togglePlay}
						className={classes.controlLeft}
					/>
					<VolumeInput disabled={disabled} className={classes.controlLeft} />
					<PlayTime className={classes.playTime} />
					<PlayProgress disabled={disabled} />
					<PlayDuration className={classes.playDuration} />
					<Tooltip title="Hide/Show Captions">
						<div className={classes.controlRight}>
							<IconToggle
								on
								onIcon={<CaptionsIcon fontSize="inherit" />}
								disabled={disabled}
								aria-label="Toggle captions"
								onToggle={onToggleCaptions}
							/>
						</div>
					</Tooltip>
					<PlaySpeed className={classes.controlRight} disabled={disabled} />
					{isFullScreenEnabled() && (
						<Tooltip title="Toggle Full Screen">
							<div className={classes.controlRight}>
								<IconToggle
									on={fullscreen}
									onIcon={<FullscreenExitIcon fontSize="inherit" />}
									offIcon={<FullscreenIcon fontSize="inherit" />}
									disabled={disabled}
									aria-label="Toggle fullscreen"
									onToggle={onToggleFullscreen}
								/>
							</div>
						</Tooltip>
					)}
				</div>
			</div>
		</MuiThemeProvider>
	);
}
