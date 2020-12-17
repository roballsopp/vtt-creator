import * as React from 'react';
import throttle from 'lodash/throttle';
import Slider from '@material-ui/core/Slider';
import VolumeIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { makeStyles } from '@material-ui/styles';
import IconToggle from './icon-toggle.component';
import useVolume from './use-volume.hook';

const useStyles = makeStyles(theme => ({
	container: {
		display: 'flex',
		alignItems: 'center',
		width: 100,
		marginRight: theme.spacing(3),
	},
	muteButton: {
		marginRight: theme.spacing(1),
	},
}));

export default function VolumeInput({ disabled, className }) {
	const classes = useStyles();
	const { volume, muted, onVolumeChange, onToggleMute } = useVolume();

	const throttledOnChange = React.useCallback(throttle(onVolumeChange, 300), [onVolumeChange]);

	React.useEffect(() => () => throttledOnChange.cancel(), [throttledOnChange]);

	return (
		<div className={className}>
			<div className={classes.container}>
				<IconToggle
					on={!!volume && !muted}
					onIcon={<VolumeIcon fontSize="inherit" />}
					offIcon={<VolumeOffIcon fontSize="inherit" />}
					disabled={disabled}
					aria-label="Toggle mute"
					onToggle={onToggleMute}
					className={classes.muteButton}
				/>
				<Slider
					value={volume}
					step={0.05}
					disabled={disabled}
					onChange={(e, v) => {
						const volume = parseFloat(v);
						onVolumeChange(volume);
						throttledOnChange(volume);
					}}
					max={1}
				/>
			</div>
		</div>
	);
}
