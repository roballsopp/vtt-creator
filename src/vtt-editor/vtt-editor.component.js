import * as React from 'react';
import * as PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/styles';
import { CuePropType } from './prop-types';
import CueEditor from './cue-editor.component';

const useStyles = makeStyles({
	container: {
		width: 400,
		height: '100%',
		padding: 16,
	},
});

VTTEditor.propTypes = {
	cues: PropTypes.arrayOf(CuePropType).isRequired,
	onChange: PropTypes.func.isRequired,
};

export default function VTTEditor({ cues, onChange }) {
	const classes = useStyles();

	const onChangeCue = i => cue => {
		const newCues = cues.slice();
		newCues[i] = cue;
		onChange(newCues);
	};

	const onAddCue = () => {
		if (cues.length) {
			const lastCue = cues[cues.length - 1];
			return onChange(cues.concat({ startTime: lastCue.endTime, endTime: lastCue.endTime + 2, text: '' }));
		}
		return onChange([{ startTime: 0, endTime: 2, text: '' }]);
	};

	const onRemoveCue = i => () => {
		const newCues = cues.slice();
		newCues.splice(i, 1);
		return onChange(newCues);
	};

	return (
		<Paper className={classes.container}>
			<Grid container spacing={8}>
				{cues.map((cue, i) => {
					return (
						<Grid key={i} item xs={12}>
							<CueEditor cue={cue} cueNumber={i + 1} onChange={onChangeCue(i)} onDelete={onRemoveCue(i)} />
						</Grid>
					);
				})}
				<Grid item xs={12}>
					<Button variant="contained" color="primary" fullWidth onClick={onAddCue}>
						Add Cue
					</Button>
				</Grid>
			</Grid>
		</Paper>
	);
}
