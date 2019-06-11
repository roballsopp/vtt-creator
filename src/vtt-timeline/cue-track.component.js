import * as React from 'react';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { List, useCues, CueProvider } from '../common';
import CueHandle from './cue-handle.component';

const useStyles = makeStyles({
	cueContainer: {
		position: 'relative',
		height: '100%',
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
	const { cues } = useCues();
	const classes = useStyles();

	return (
		<List
			className={classes.cueContainer}
			data={cues}
			// TODO: its unlikely but possible for two cues to have the exact same start time
			getKey={cue => cue.startTime}
			renderItem={(cue, i) => (
				<CueProvider cue={cue} cueIndex={i}>
					<CueHandle>
						<div className={classes.cueContent}>
							<Typography color="inherit" variant="h5" noWrap>
								{cue.text}
							</Typography>
						</div>
					</CueHandle>
				</CueProvider>
			)}
		/>
	);
}
