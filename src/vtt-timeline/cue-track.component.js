import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { List, useCues } from '../common';
import CueHandle from './cue-handle.component';

const useStyles = makeStyles({
	cueContainer: {
		position: 'relative',
		height: '100%',
		zIndex: 5,
		color: 'white',
	},
	cueContent: {
		backgroundColor: 'rgba(0, 0, 0, 0.4)',
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		height: '100%',
		padding: 30,
		userSelect: 'none',
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
			renderItem={(cue, i) => (
				<CueHandle cue={cue} cueIndex={i} onChange={onChangeCue}>
					<div className={classes.cueContent}>
						<Typography color="inherit" variant="h5" noWrap>
							&quot;{cue.text}&quot;
						</Typography>
					</div>
				</CueHandle>
			)}
		/>
	);
}
