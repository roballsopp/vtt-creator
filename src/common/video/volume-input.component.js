import * as React from 'react';
import throttle from 'lodash.throttle';
import Slider from '@material-ui/lab/Slider';
import VolumeIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { makeStyles } from '@material-ui/styles';
import IconToggle from './icon-toggle.component';
import { useVolume } from './volume.context';

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
	trackBefore: {
		backgroundColor: 'white',
	},
	thumb: {
		backgroundColor: 'white',
	},
	trackAfter: {
		backgroundColor: 'white',
	},
});

export default function VolumeInput() {
	const { volume, muted, onVolumeChange, onToggleMute } = useVolume();
	const classes = useStyles();
	const [sliderPos, setSliderPos] = React.useState(volume);
	const throttledOnChange = React.useCallback(throttle(onVolumeChange, 300), [onVolumeChange]);

	React.useEffect(() => () => throttledOnChange.cancel(), [throttledOnChange]);
	React.useEffect(() => setSliderPos(volume), [volume]);

	return (
		<div className={classes.container}>
			<Slider
				value={sliderPos}
				onChange={(e, v) => {
					const volume = parseFloat(v);
					setSliderPos(volume);
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
