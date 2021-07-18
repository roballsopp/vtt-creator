import PropTypes from 'prop-types'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import {makeStyles} from '@material-ui/styles'
import debounce from 'lodash/debounce'
import {useKeyboardControl} from '../common/video'
import TimingInput from './timing-input.component'

const useStyles = makeStyles({
	header: {
		backgroundColor: 'white',
	},
	timingRow: {
		display: 'flex',
	},
	timingInput: {
		marginRight: 4,
		flex: 1,
	},
	iconWrapper: {
		display: 'flex',
		alignItems: 'center',
	},
})

CueEditor.propTypes = {
	cue: PropTypes.shape({
		id: PropTypes.string.isRequired,
		startTime: PropTypes.number.isRequired,
		endTime: PropTypes.number.isRequired,
		text: PropTypes.string.isRequired,
	}).isRequired,
	onRemoveCue: PropTypes.func.isRequired,
	onChangeCueEnd: PropTypes.func.isRequired,
	onChangeCueStart: PropTypes.func.isRequired,
	onChangeCueText: PropTypes.func.isRequired,
}

function CueEditor({cue, onRemoveCue, onChangeCueEnd, onChangeCueStart, onChangeCueText}) {
	const classes = useStyles()
	const captionInputKeyCtrl = useKeyboardControl()
	const startInputKeyCtrl = useKeyboardControl()
	const durInputKeyCtrl = useKeyboardControl()
	const endInputKeyCtrl = useKeyboardControl()
	const [text, setText] = React.useState(cue.text)

	const debouncedOnChangeText = React.useCallback(debounce(onChangeCueText, 400), [onChangeCueText])

	React.useEffect(() => {
		setText(cue.text)
		return () => {
			debouncedOnChangeText.flush()
		}
	}, [debouncedOnChangeText, cue.text])

	const onChangeText = e => {
		setText(e.target.value)
		debouncedOnChangeText(cue.id, e.target.value)
	}

	const onChangeStartTime = secs => {
		onChangeCueStart(cue.id, Number(secs))
	}

	const onChangeEndTime = secs => {
		onChangeCueEnd(cue.id, Number(secs))
	}

	const onChangeTimeSpan = secs => {
		onChangeCueEnd(cue.id, cue.startTime + Number(secs))
	}

	const handleRemoveCue = () => {
		onRemoveCue(cue.id)
	}

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
					<div className={classes.iconWrapper}>
						<IconButton aria-label="Delete" onClick={handleRemoveCue} size="small" edge="end">
							<CloseIcon fontSize="small" />
						</IconButton>
					</div>
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
						captionInputKeyCtrl.onBlur()
						debouncedOnChangeText.flush()
					}}
					placeholder="Enter your caption here..."
				/>
			</div>
		</div>
	)
}

export default React.memo(CueEditor)
