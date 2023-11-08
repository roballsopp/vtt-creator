import React from 'react'
import * as PropTypes from 'prop-types'
import {
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	FormHelperText,
	FormLabel,
	FormControlLabel,
	Input,
	InputAdornment,
	InputLabel,
	MenuItem,
	Select,
	Switch,
} from '@material-ui/core'
import {Button} from '../common'

CueOptionsDialog.propTypes = {
	cue: PropTypes.shape({
		id: PropTypes.string.isRequired,
		vertical: PropTypes.string.isRequired,
		position: PropTypes.number.isRequired,
		align: PropTypes.string.isRequired,
		line: PropTypes.number.isRequired,
	}).isRequired,
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
	onChangeVertical: PropTypes.func.isRequired,
	onChangeHorizPos: PropTypes.func.isRequired,
	onChangeAlign: PropTypes.func.isRequired,
	onChangeLinePos: PropTypes.func.isRequired,
}

export default function CueOptionsDialog({
	cue,
	open,
	onClose,
	onChangeVertical,
	onChangeHorizPos,
	onChangeAlign,
	onChangeLinePos,
}) {
	const [vertPosAuto, setVertPosAuto] = React.useState(cue.line === 'auto')
	const [linePos, setLinePos] = React.useState(cue.line === 'auto' ? 100 : cue.line)

	const handleChangeVertical = (e) => {
		if (e.target.value === 'hz') {
			onChangeVertical('')
		} else {
			onChangeVertical(e.target.value)
		}
	}

	const handleChangeHorizPos = (e) => {
		onChangeHorizPos(clampPercent(Number(e.target.value)))
	}

	const handleChangeLinePos = (e) => {
		const val = clampPercent(Number(e.target.value))
		setLinePos(val)
		onChangeLinePos(val)
	}

	const handleChangeVertPosAuto = (e) => {
		setVertPosAuto(e.target.checked)
		if (e.target.checked) {
			onChangeLinePos('auto')
		} else {
			onChangeLinePos(linePos)
		}
	}

	const handleChangeAlign = (e) => {
		onChangeAlign(e.target.value)
	}

	return (
		<Dialog maxWidth="sm" fullWidth open={open} onClose={onClose} aria-labelledby="advanced-options-dialog-title">
			<DialogTitle id="advanced-options-dialog-title">Advanced Cue Options</DialogTitle>
			<DialogContent>
				<Box display="flex">
					<Box width={120}>
						<FormControl component="fieldset">
							<FormLabel component="legend">Vertical Position</FormLabel>
							<FormControlLabel
								control={<Switch checked={vertPosAuto} onChange={handleChangeVertPosAuto} name="vertPosAuto" />}
								label="Auto"
							/>
						</FormControl>
					</Box>
					<Box flex={1}>
						<FormControl margin="normal" disabled={vertPosAuto} fullWidth>
							<Input
								inputProps={{
									name: 'vert-pos-text',
									id: 'vert-pos-text',
									max: 100,
									min: 0,
								}}
								type="number"
								value={linePos}
								onChange={handleChangeLinePos}
								endAdornment={<InputAdornment position="end">%</InputAdornment>}
								aria-describedby="vert-pos-helper-text"
							/>
						</FormControl>
					</Box>
				</Box>
				<Box mt={-2}>
					<FormHelperText id="vert-pos-helper-text">Change the vertical position of the cue text.</FormHelperText>
				</Box>
				<FormControl margin="normal" fullWidth>
					<InputLabel htmlFor="horiz-pos-text">Horizontal Position</InputLabel>
					<Input
						inputProps={{
							name: 'horiz-pos-text',
							id: 'horiz-pos-text',
							max: 100,
							min: 0,
						}}
						type="number"
						value={cue.position}
						onChange={handleChangeHorizPos}
						endAdornment={<InputAdornment position="end">%</InputAdornment>}
						aria-describedby="horiz-pos-helper-text"
					/>
					<FormHelperText id="horiz-pos-helper-text">Change the horizontal position of the cue text.</FormHelperText>
				</FormControl>
				<FormControl margin="normal" fullWidth>
					<InputLabel htmlFor="vert-text">Text Direction</InputLabel>
					<Select
						value={cue.vertical || 'hz'}
						onChange={handleChangeVertical}
						inputProps={{
							name: 'vert-text',
							id: 'vert-text',
						}}>
						<MenuItem value="hz">Horizontal Left-Right</MenuItem>
						<MenuItem value="rl">Vertical, Right-Left</MenuItem>
						<MenuItem value="lr">Vertical, Left-Right</MenuItem>
					</Select>
					<FormHelperText>
						Display cue text vertically or horizontally, and specify the writing direction.
					</FormHelperText>
				</FormControl>
				<FormControl margin="normal" fullWidth>
					<InputLabel htmlFor="align-text">Text Alignment</InputLabel>
					<Select
						value={cue.align}
						onChange={handleChangeAlign}
						inputProps={{
							name: 'align-text',
							id: 'align-text',
						}}>
						<MenuItem value="start">Start</MenuItem>
						<MenuItem value="middle">Center</MenuItem>
						<MenuItem value="end">End</MenuItem>
					</Select>
					<FormHelperText>Align the cue text within the cue space.</FormHelperText>
				</FormControl>
			</DialogContent>
			<DialogActions>
				<Button name="Cue Options Close" onClick={onClose} color="primary">
					Close
				</Button>
			</DialogActions>
		</Dialog>
	)
}

function clampPercent(val) {
	return Math.min(Math.max(val, 0), 100)
}
