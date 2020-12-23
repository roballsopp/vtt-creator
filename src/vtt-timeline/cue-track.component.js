import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { useCues } from '../common';
import CueHandle from './cue-handle';
import { CueTrackProvider } from './cue-track-context';

const useStyles = makeStyles({
	cueContainer: {
		position: 'relative',
		height: '100%',
		color: 'white',
	},
});

CueTrack.propTypes = {};

export default function CueTrack() {
	const { cues, changeCueTiming, onRemoveCue } = useCues();
	const classes = useStyles();

	return (
		<CueTrackProvider className={classes.cueContainer}>
			{cues.map((cue, i) => (
				<CueHandle cue={cue} cueIndex={i} onChangeCueTiming={changeCueTiming} onRemoveCue={onRemoveCue} key={cue.id} />
			))}
		</CueTrackProvider>
	);
}
