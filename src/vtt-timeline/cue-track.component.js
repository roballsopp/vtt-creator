import React from 'react';
import { makeStyles } from '@material-ui/styles';
import { List, useCues, CueProvider } from '../common';
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
	const { cues } = useCues();
	const classes = useStyles();

	return (
		<List
			className={classes.cueContainer}
			data={cues}
			getKey={cue => cue.id}
			renderItem={(cue, i) => (
				<CueProvider cue={cue} cueIndex={i}>
					<CueHandle startTime={cue.startTime} endTime={cue.endTime} text={cue.text} />
				</CueProvider>
			)}
		/>
	);
}
