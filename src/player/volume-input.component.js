import * as React from 'react';
import throttle from 'lodash.throttle';
import * as PropType from 'prop-types';
import Slider from '@material-ui/lab/Slider';
import VolumeIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { makeStyles } from '@material-ui/styles';
import IconToggle from './icon-toggle.component';

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

VolumeInput.propTypes = {
	value: PropType.number,
	onChange: PropType.func.isRequired,
	muted: PropType.bool,
	onToggleMute: PropType.func.isRequired,
};

export default function VolumeInput({ value, muted, onChange, onToggleMute }) {
	const classes = useStyles();
	const [sliderPos, setSliderPos] = React.useState(value);
	const throttledOnChange = React.useCallback(throttle(onChange, 300), [onChange]);

	React.useEffect(() => () => throttledOnChange.cancel(), [throttledOnChange]);
	React.useEffect(() => setSliderPos(value), [value]);

	return (
		<div className={classes.container}>
			<Slider
				value={sliderPos}
				onChange={(e, v) => {
					const volume = parseFloat(v);
					setSliderPos(volume);
					throttledOnChange(e, volume);
				}}
				max={1}
				classes={useSliderStyles()}
			/>
			<div className={classes.muteButton}>
				<IconToggle
					on={!!value && !muted}
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
