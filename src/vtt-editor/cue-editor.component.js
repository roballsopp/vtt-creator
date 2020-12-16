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
	timingRow: {
		display: 'flex',
	},
	timingInput: {
		marginRight: 4,
	},
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
		<div>
			<div className={classes.timingRow}>
				<TimingInput
					{...startInputKeyCtrl}
					className={classes.timingInput}
					margin="dense"
					variant="outlined"
					label="Start Time"
					value={cue.startTime}
					onChange={onChangeStartTime}
				/>
				<TimingInput
					{...durInputKeyCtrl}
					className={classes.timingInput}
					margin="dense"
					variant="outlined"
					label="Show For"
					value={cue.endTime - cue.startTime}
					onChange={onChangeTimeSpan}
				/>
				<TimingInput
					{...endInputKeyCtrl}
					className={classes.timingInput}
					margin="dense"
					variant="outlined"
					label="End Time"
					value={cue.endTime}
					onChange={onChangeEndTime}
				/>
				<Tooltip title="Delete Cue">
					<IconButton aria-label="Delete" onClick={onRemoveCue} className={classes.closeIcon} edge="end">
						<CloseIcon fontSize="small" />
					</IconButton>
				</Tooltip>
			</div>
			<div>
				<TextField
					variant="outlined"
					margin="dense"
					fullWidth
					multiline
					rows="3"
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
			</div>
		</div>
	);
}
