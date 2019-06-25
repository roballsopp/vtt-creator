import * as React from 'react';
import Divider from '@material-ui/core/Divider';
import FabButton from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import { List, Loader, useCues, CueProvider } from '../common';
import CueEditor from './cue-editor.component';
import { AutoScrollProvider } from './auto-scroll.context';
import AutoScrollItem from './auto-scroll-item.component';
import CueLoader from './cue-loader.component';

const useStyles = makeStyles({
	root: {
		position: 'relative',
		flex: 1,
		width: 400,
	},
	list: {
		marginTop: 4,
		marginBottom: 90,
	},
	cueEditor: {
		padding: 16,
	},
	fab: {
		position: 'absolute',
		bottom: 16,
		right: 16,
	},
});

VTTEditor.propTypes = {};

export default function VTTEditor() {
	const classes = useStyles();
	const { cues, loading, onAddCue } = useCues();

	return (
		<div className={classes.root}>
			{!loading && !cues.length && <CueLoader />}
			{!loading && cues.length && (
				<AutoScrollProvider>
					<List
						className={classes.list}
						data={cues}
						// TODO: its unlikely but possible for two cues to have the exact same start time
						getKey={cue => cue.startTime}
						renderItem={(cue, i, isLast) => (
							<CueProvider cue={cue} cueIndex={i}>
								<AutoScrollItem cueTime={cue.startTime} className={classes.cueEditor}>
									<CueEditor />
								</AutoScrollItem>
								{!isLast && <Divider />}
							</CueProvider>
						)}
					/>
				</AutoScrollProvider>
			)}
			{loading && <Loader />}
			<FabButton className={classes.fab} color="primary" aria-label="Add Cue" onClick={onAddCue}>
				<AddIcon />
			</FabButton>
		</div>
	);
}
