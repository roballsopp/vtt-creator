import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import AudioTrack from './audio-track.component';

const useStyles = makeStyles({
	root: {
		position: 'relative',
		height: '100%',
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
		<div className={classes.root}>
			<AudioTrack />
		</div>
	);
}
