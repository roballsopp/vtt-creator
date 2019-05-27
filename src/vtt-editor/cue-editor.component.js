import * as React from 'react';
import * as PropTypes from 'prop-types';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/styles';
import { CuePropType } from '../services/vtt.service';
import TimingInput from './timing-input.component';

const useStyles = makeStyles({
	header: {
		backgroundColor: 'white',
	},
	headerEnd: {
		width: 48,
		textAlign: 'center',
	},
});

CueEditor.propTypes = {
	cue: CuePropType.isRequired,
	onChange: PropTypes.func.isRequired,
	onDelete: PropTypes.func.isRequired,
};

export default function CueEditor({ cue, onChange, onDelete }) {
	const classes = useStyles();

	const onChangeText = e => {
		onChange({ ...cue, text: e.target.value });
	};

	const onChangeStartTime = e => {
		const startTime = parseFloat(e.target.value);
		const offset = startTime - cue.startTime;
		onChange({ ...cue, startTime, endTime: cue.endTime + offset });
	};

	const onChangeEndTime = e => {
		onChange({ ...cue, endTime: parseFloat(e.target.value) });
	};

	const onChangeTimeSpan = e => {
		onChange({ ...cue, endTime: cue.startTime + parseFloat(e.target.value) });
	};

	return (
		<Grid container>
			<Grid container item xs={12} alignItems="center" spacing={8} wrap="nowrap">
				<Grid item>
					<TimingInput
						margin="normal"
						variant="outlined"
						label="Start Time"
						value={cue.startTime}
						onChange={onChangeStartTime}
					/>
				</Grid>
				<Grid item>
					<TimingInput
						margin="normal"
						variant="outlined"
						label="Show For"
						value={cue.endTime - cue.startTime}
						onChange={onChangeTimeSpan}
					/>
				</Grid>
				<Grid item>
					<TimingInput
						margin="normal"
						variant="outlined"
						label="End Time"
						value={cue.endTime}
						onChange={onChangeEndTime}
					/>
				</Grid>
				<Grid item className={classes.headerEnd}>
					<IconButton aria-label="Delete" onClick={onDelete}>
						<CloseIcon />
					</IconButton>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<TextField
					variant="outlined"
					fullWidth
					multiline
					rows="2"
					margin="normal"
					label="Caption text"
					value={cue.text}
					onChange={onChangeText}
					placeholder="Enter your caption here..."
				/>
			</Grid>
		</Grid>
	);
}
