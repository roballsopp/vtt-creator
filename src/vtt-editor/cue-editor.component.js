import PropTypes from 'prop-types'
import React from 'react'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import MoreIcon from '@material-ui/icons/MoreVert'
import TextField from '@material-ui/core/TextField'
import Tooltip from '@material-ui/core/Tooltip'
import {makeStyles} from '@material-ui/styles'
import debounce from 'lodash/debounce'
import {useKeyboardControl} from '../common/video'
import TimingInput from './timing-input.component'
import MenuItem from '@material-ui/core/MenuItem'
import Menu from '@material-ui/core/Menu'
import CueOptionsDialog from './CueOptionsDialog'

const useStyles = makeStyles({
	header: {
		backgroundColor: 'white',
	},
	timingRow: {
		display: 'flex',
	},
	timingInput: {
		marginRight: 8,
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
	onChangeCueVert: PropTypes.func.isRequired,
	onChangeCueHoriz: PropTypes.func.isRequired,
	onChangeCueAlign: PropTypes.func.isRequired,
	onChangeCueLinePos: PropTypes.func.isRequired,
}

function CueEditor({
	cue,
	onRemoveCue,
	onChangeCueEnd,
	onChangeCueStart,
	onChangeCueText,
	onChangeCueVert,
	onChangeCueHoriz,
	onChangeCueAlign,
	onChangeCueLinePos,
}) {
	const classes = useStyles()
	const captionInputKeyCtrl = useKeyboardControl()
	const startInputKeyCtrl = useKeyboardControl()
	const endInputKeyCtrl = useKeyboardControl()
	const [text, setText] = React.useState(cue.text)
	const [disabled, setDisabled] = React.useState(false)
	const [cueOptionsDialogOpen, setCueOptionsDialogOpen] = React.useState(false)
	const [optionsMenuAnchorEl, setOptionsMenuAnchorEl] = React.useState(null)

	const debouncedOnChangeText = React.useCallback(debounce(onChangeCueText, 400), [onChangeCueText])

	React.useEffect(() => {
		setText(cue.text)
		return () => {
			debouncedOnChangeText.flush()
		}
	}, [debouncedOnChangeText, cue.text])

	const onChangeText = (e) => {
		setText(e.target.value)
		debouncedOnChangeText(cue.id, e.target.value)
	}

	const onChangeStartTime = (secs) => {
		onChangeCueStart(cue.id, Number(secs))
	}

	const onChangeEndTime = (secs) => {
		onChangeCueEnd(cue.id, Number(secs))
	}

	const onChangeVert = (newVert) => {
		onChangeCueVert(cue.id, newVert)
	}

	const onChangeHoriz = (newPos) => {
		onChangeCueHoriz(cue.id, newPos)
	}

	const onChangeAlign = (newAlign) => {
		onChangeCueAlign(cue.id, newAlign)
	}

	const onChangeLinePos = (newLine) => {
		onChangeCueLinePos(cue.id, newLine)
	}

	const handleRemoveCue = () => {
		setDisabled(true)
		onRemoveCue(cue.id)
	}

	const onOpenOptionsMenu = (e) => {
		setOptionsMenuAnchorEl(e.currentTarget)
	}

	const onCloseOptionsMenu = () => {
		setOptionsMenuAnchorEl(null)
	}

	const onOpenAdvancedDialog = (e) => {
		setCueOptionsDialogOpen(true)
		setOptionsMenuAnchorEl(null)
	}

	const onCloseAdvancedDialog = () => {
		setCueOptionsDialogOpen(false)
	}

	return (
		<React.Fragment>
			<div>
				<div className={classes.timingRow}>
					<TimingInput
						{...startInputKeyCtrl}
						disabled={disabled}
						className={classes.timingInput}
						margin="dense"
						variant="outlined"
						label="Start Time"
						value={cue.startTime}
						onChange={onChangeStartTime}
					/>
					<TimingInput
						{...endInputKeyCtrl}
						disabled={disabled}
						className={classes.timingInput}
						margin="dense"
						variant="outlined"
						label="End Time"
						value={cue.endTime}
						onChange={onChangeEndTime}
					/>
					<Tooltip title="Cue Options">
						<div className={classes.iconWrapper}>
							<IconButton aria-label="Cue Options" onClick={onOpenOptionsMenu} size="small" edge="end">
								<MoreIcon fontSize="small" />
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
						autoFocus
						disabled={disabled}
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
			<Menu anchorEl={optionsMenuAnchorEl} open={Boolean(optionsMenuAnchorEl)} onClose={onCloseOptionsMenu}>
				<MenuItem onClick={onOpenAdvancedDialog}>Advanced options...</MenuItem>
				<MenuItem disabled={disabled} onClick={handleRemoveCue}>
					Delete Cue
				</MenuItem>
			</Menu>
			<CueOptionsDialog
				cue={cue}
				open={cueOptionsDialogOpen}
				onClose={onCloseAdvancedDialog}
				onChangeVertical={onChangeVert}
				onChangeHorizPos={onChangeHoriz}
				onChangeAlign={onChangeAlign}
				onChangeLinePos={onChangeLinePos}
			/>
		</React.Fragment>
	)
}

export default React.memo(CueEditor)
