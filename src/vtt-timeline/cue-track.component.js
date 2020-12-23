import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useCues } from '../common';
import CueHandle from './cue-handle';

const useStyles = makeStyles({
	cueContainer: {
		position: 'relative',
		height: '100%',
		color: 'white',
	},
});

CueTrack.propTypes = {};

export default function CueTrack() {
	const { cues, changeCueTiming } = useCues();
	const classes = useStyles();

	return (
		<div className={classes.cueContainer}>
			{cues.map((cue, i) => (
				<CueHandle cue={cue} cueIndex={i} onChangeCueTiming={changeCueTiming} key={cue.id} />
			))}
		</div>
	);
}
