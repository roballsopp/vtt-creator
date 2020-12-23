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
	const { cues, changeCueTiming, removeCue } = useCues();
	const classes = useStyles();

	return (
		<CueTrackProvider className={classes.cueContainer}>
			{cues.map(cue => (
				<CueHandle cue={cue} onChangeCueTiming={changeCueTiming} onRemoveCue={removeCue} key={cue.id} />
			))}
		</CueTrackProvider>
	);
}
