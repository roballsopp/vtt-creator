import * as React from 'react';
import { makeStyles } from '@material-ui/styles';
import { List, useCues } from '../common';
import CueHandle from './cue-handle.component';

const useStyles = makeStyles({
	cueContainer: {
		position: 'relative',
		height: '100%',
	},
});

CueTrack.propTypes = {};

export default function CueTrack() {
	const { cues, onChangeCue } = useCues();
	const classes = useStyles();

	return (
		<List
			className={classes.cueContainer}
			data={cues}
			getKey={cue => cue.startTime}
			renderItem={(cue, i) => <CueHandle cue={cue} cueIndex={i} onChange={onChangeCue} />}
		/>
	);
}
