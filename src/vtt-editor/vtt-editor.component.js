import * as React from 'react';
import * as PropTypes from 'prop-types';
import Divider from '@material-ui/core/Divider';
import FabButton from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/styles';
import { List, Loader, useCues } from '../common';
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
	const { cues, loading, onChangeCue, onAddCue, onRemoveCue } = useCues();

	return (
		<div className={classes.fabContainer}>
			<div className={classes.listRoot}>
				{!loading && (
					<List
						data={cues}
						renderItem={(cue, i, isLast) => (
							<React.Fragment>
								<div className={classes.cueEditor}>
									<CueEditor cue={cue} onChange={(c, r) => onChangeCue(c, i, r)} onDelete={() => onRemoveCue(i)} />
								</div>
								{!isLast && <Divider />}
							</React.Fragment>
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
