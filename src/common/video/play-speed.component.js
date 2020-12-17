import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import SpeedIcon from '@material-ui/icons/Speed';
import Tooltip from '@material-ui/core/Tooltip';
import { useVideoDom } from './video-dom.context';

export default function PlaySpeed({ disabled, className }) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [speed, setSpeed] = React.useState(1);

	const { videoRef } = useVideoDom();

	const handleOpenMenu = e => {
		setAnchorEl(e.currentTarget);
	};

	const handleSelectSpeed = speed => () => {
		setSpeed(speed);
		videoRef.playbackRate = speed;
		setAnchorEl(null);
	};

	const handleCloseMenu = () => {
		setAnchorEl(null);
	};

	return (
		<React.Fragment>
			<Tooltip title="Playback Speed">
				<div className={className}>
					<IconButton
						color="inherit"
						disabled={disabled}
						aria-label="Change Playback Speed"
						onClick={handleOpenMenu}>
						<SpeedIcon fontSize="inherit" />
					</IconButton>
				</div>
			</Tooltip>
			<Menu id="playback-speed-menu" anchorEl={anchorEl} keepMounted open={Boolean(anchorEl)} onClose={handleCloseMenu}>
				<MenuItem dense selected={speed === 0.25} onClick={handleSelectSpeed(0.25)}>
					0.25x
				</MenuItem>
				<MenuItem dense selected={speed === 0.5} onClick={handleSelectSpeed(0.5)}>
					0.5x
				</MenuItem>
				<MenuItem dense selected={speed === 0.75} onClick={handleSelectSpeed(0.75)}>
					0.75x
				</MenuItem>
				<MenuItem dense selected={speed === 1.0} onClick={handleSelectSpeed(1.0)}>
					1.0x
				</MenuItem>
				<MenuItem dense selected={speed === 1.25} onClick={handleSelectSpeed(1.25)}>
					1.25x
				</MenuItem>
				<MenuItem dense selected={speed === 1.5} onClick={handleSelectSpeed(1.5)}>
					1.5x
				</MenuItem>
				<MenuItem dense selected={speed === 1.75} onClick={handleSelectSpeed(1.75)}>
					1.75x
				</MenuItem>
				<MenuItem dense selected={speed === 2.0} onClick={handleSelectSpeed(2.0)}>
					2.0x
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}
