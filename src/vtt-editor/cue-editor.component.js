import * as React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import { makeStyles } from '@material-ui/styles';
import debounce from 'lodash/debounce';
import { useCue } from '../common';
import { useKeyboardControl } from '../common/video';
import TimingInput from './timing-input.component';

const useStyles = makeStyles({
	header: {
		backgroundColor: 'white',
	},
	headerEnd: {},
	closeIcon: {
		padding: 8,
		marginLeft: -4,
	},
});

CueEditor.propTypes = {};

export default function CueEditor() {
	const classes = useStyles();
	const { cue, onChangeCueStart, onChangeCueEnd, onChangeCueText, onRemoveCue } = useCue();
	const captionInputKeyCtrl = useKeyboardControl();
	const startInputKeyCtrl = useKeyboardControl();
	const durInputKeyCtrl = useKeyboardControl();
	const endInputKeyCtrl = useKeyboardControl();
	const [text, setText] = React.useState(cue.text);

	const debouncedOnChangeText = React.useCallback(debounce(onChangeCueText, 400), [onChangeCueText]);

	React.useEffect(() => {
		setText(cue.text);
		return () => {
			debouncedOnChangeText.flush();
		};
	}, [debouncedOnChangeText, cue.text]);

	const onChangeText = e => {
		setText(e.target.value);
		debouncedOnChangeText(e.target.value);
	};

	const onChangeStartTime = secs => {
		onChangeCueStart(Number(secs));
	};

	const onChangeEndTime = secs => {
		onChangeCueEnd(Number(secs));
	};

	const onChangeTimeSpan = secs => {
		onChangeCueEnd(cue.startTime + Number(secs));
	};

	return (
		<Grid container spacing={2}>
			<Grid container item alignItems="center" spacing={1} wrap="nowrap" justify="space-between">
				<Grid item>
					<TimingInput
						{...startInputKeyCtrl}
						variant="outlined"
						label="Start Time"
						value={cue.startTime}
						onChange={onChangeStartTime}
					/>
				</Grid>
				<Grid item>
					<TimingInput
						{...durInputKeyCtrl}
						variant="outlined"
						label="Show For"
						value={cue.endTime - cue.startTime}
						onChange={onChangeTimeSpan}
					/>
				</Grid>
				<Grid item>
					<TimingInput
						{...endInputKeyCtrl}
						variant="outlined"
						label="End Time"
						value={cue.endTime}
						onChange={onChangeEndTime}
					/>
				</Grid>
				<Grid item className={classes.headerEnd}>
					<Tooltip title="Delete Cue">
						<IconButton aria-label="Delete" onClick={onRemoveCue} className={classes.closeIcon} edge="end">
							<CloseIcon fontSize="small" />
						</IconButton>
					</Tooltip>
				</Grid>
			</Grid>
			<Grid item xs={12}>
				<TextField
					variant="outlined"
					fullWidth
					multiline
					rows="2"
					label="Caption text"
					value={text}
					onChange={onChangeText}
					onFocus={captionInputKeyCtrl.onFocus}
					onBlur={() => {
						captionInputKeyCtrl.onBlur();
						debouncedOnChangeText.flush();
					}}
					placeholder="Enter your caption here..."
				/>
			</Grid>
		</Grid>
	);
}
