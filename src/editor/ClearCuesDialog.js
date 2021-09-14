import React from 'react'
import * as PropTypes from 'prop-types'
import {Dialog, DialogActions, DialogContent, DialogTitle} from '@material-ui/core'
import {Button, useCues} from '../common'

ClearCuesDialog.propTypes = {
	open: PropTypes.bool.isRequired,
	onClose: PropTypes.func.isRequired,
}

export default function ClearCuesDialog({open, onClose}) {
	const {setCues} = useCues()

	const onClearCues = () => {
		setCues([])
		onClose()
	}

	return (
		<Dialog maxWidth="sm" fullWidth open={open} onClose={onClose} aria-labelledby="clear-cues-dialog-title">
			<DialogTitle id="clear-cues-dialog-title">Are you sure you want to delete your cues?</DialogTitle>
			<DialogContent>
				This will delete all the cues you have created or extracted, and you&apos;ll have to start over. Are you sure
				you want to proceed?
			</DialogContent>
			<DialogActions>
				<Button name="Delete Cues Cancel" onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button name="Delete Cues Confirm" onClick={onClearCues} color="primary" variant="contained">
					Yes, Delete Cues
				</Button>
			</DialogActions>
		</Dialog>
	)
}
