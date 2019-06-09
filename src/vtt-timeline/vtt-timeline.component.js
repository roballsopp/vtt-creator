import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import AudioTrack from './audio-track.component';
import ZoomContainer from './zoom-container.component';

const useStyles = makeStyles({
	root: {
		position: 'relative',
		height: '100%',
		width: '100%',
		backgroundColor: 'gray',
	},
	cueTrack: {
		position: 'absolute',
		top: 0,
		bottom: 0,
		left: 0,
		right: 0,
	},
});

VttTimeline.propTypes = {};

export default function VttTimeline() {
	const classes = useStyles();

	return (
		<ZoomContainer>
			<div className={classes.root}>
				<AudioTrack />
			</div>
		</ZoomContainer>
	);
}
