import * as React from 'react';
import Divider from '@material-ui/core/Divider';
import FabButton from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import { List, Loader, useCues, CueProvider } from '../common';
import CueEditor from './cue-editor.component';

const useStyles = makeStyles({
	listRoot: {
		width: 400,
		paddingTop: 4,
		paddingBottom: 90,
		height: '100%',
		overflowY: 'scroll',
	},
	cueEditor: {
		padding: 16,
	},
	fab: {
		position: 'absolute',
		bottom: 16,
		right: 16,
	},
	fabContainer: {
		height: '100%',
		display: 'flex',
		flexDirection: 'column',
		position: 'relative',
	},
});

VTTEditor.propTypes = {};

export default function VTTEditor() {
	const classes = useStyles();
	const { cues, loading, onAddCue } = useCues();

	return (
		<div className={classes.fabContainer}>
			<div className={classes.listRoot}>
				{!loading && (
					<List
						data={cues}
						// TODO: its unlikely but possible for two cues to have the exact same start time
						getKey={cue => cue.startTime}
						renderItem={(cue, i, isLast) => (
							<CueProvider cue={cue} cueIndex={i}>
								<div className={classes.cueEditor}>
									<CueEditor />
								</div>
								{!isLast && <Divider />}
							</CueProvider>
						)}
					/>
				)}
				{loading && <Loader />}
			</div>
			<FabButton className={classes.fab} color="primary" aria-label="Add Cue" onClick={onAddCue}>
				<AddIcon />
			</FabButton>
		</div>
	);
}
