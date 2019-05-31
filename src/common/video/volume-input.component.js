import * as React from 'react';
import * as PropType from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Slider from '@material-ui/lab/Slider';
import VolumeIcon from '@material-ui/icons/VolumeUp';
import VolumeOffIcon from '@material-ui/icons/VolumeOff';
import { makeStyles } from '@material-ui/styles';

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

VolumeInput.propTypes = {
	value: PropType.number,
	onChange: PropType.func.isRequired,
	muted: PropType.bool,
	onToggleMute: PropType.func.isRequired,
};

export default function VolumeInput({ value, muted, onChange, onToggleMute }) {
	const classes = useStyles();
	return (
		<div className={classes.container}>
			<Slider value={value} onChange={onChange} max={1} />
			<div className={classes.muteButton}>
				{value && !muted && (
					<IconButton aria-label="Mute" size="small" edge="start" onClick={onToggleMute}>
						<VolumeIcon />
					</IconButton>
				)}
				{(!value || muted) && (
					<IconButton aria-label="Unmute" size="small" edge="start" onClick={onToggleMute}>
						<VolumeOffIcon />
					</IconButton>
				)}
			</div>
		</div>
	);
}
