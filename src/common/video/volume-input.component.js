import * as React from 'react';
import throttle from 'lodash/throttle';
import Slider from '@material-ui/core/Slider';
import VolumeIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { makeStyles } from '@material-ui/styles';
import IconToggle from './icon-toggle.component';
import useVolume from './use-volume.hook';

const useStyles = makeStyles({
	container: {
		display: 'flex',
		alignItems: 'center',
		width: 100,
	},
	muteButton: {
		marginLeft: 12,
	},
});

const useSliderStyles = makeStyles({
	track: {
		backgroundColor: 'white',
	},
	thumb: {
		backgroundColor: 'white',
	},
	rail: {
		backgroundColor: 'white',
	},
});

export default function VolumeInput() {
	const classes = useStyles();
	const { volume, muted, onVolumeChange, onToggleMute } = useVolume();

	const throttledOnChange = React.useCallback(throttle(onVolumeChange, 300), [onVolumeChange]);

	React.useEffect(() => () => throttledOnChange.cancel(), [throttledOnChange]);

	return (
		<div className={classes.container}>
			<Slider
				value={volume}
				step={0.05}
				onChange={(e, v) => {
					const volume = parseFloat(v);
					onVolumeChange(volume);
					throttledOnChange(volume);
				}}
				max={1}
				classes={useSliderStyles()}
			/>
			<div className={classes.muteButton}>
				<IconToggle
					on={!!volume && !muted}
					onIcon={<VolumeIcon />}
					offIcon={<VolumeOffIcon />}
					aria-label="Toggle mute"
					size="small"
					color="inherit"
					onToggle={onToggleMute}
				/>
			</div>
		</div>
	);
}
