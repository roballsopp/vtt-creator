import React from 'react'
import PropTypes from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import Typography from '@material-ui/core/Typography'
import CloseIcon from '@material-ui/icons/Close'
import {styled} from '@material-ui/styles'
import AddCreditInput from '../../account/AddCreditInput'
import {Button} from '../../common'
import {CreditDialog_userFragment} from './CreditDialog.graphql'

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
})

CreditDialog.fragments = {
	user: CreditDialog_userFragment,
}

CreditDialog.propTypes = {
	user: PropTypes.shape({
		credit: PropTypes.number.isRequired,
	}).isRequired,
	transcriptionCost: PropTypes.number.isRequired,
	open: PropTypes.bool,
	onPaid: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	onExited: PropTypes.func.isRequired,
}

export default function CreditDialog({user, transcriptionCost, open, onClose, onPaid, onExited}) {
	const defaultValue = Math.max(transcriptionCost - user.credit, 1).toFixed(2)

	function handleClose(e, reason) {
		if (['backdropClick', 'escapeKeyDown'].includes(reason)) {
			return
		}
		onClose(e)
	}

	return (
		<Dialog
			maxWidth="sm"
			fullWidth
			open={open}
			onClose={handleClose}
			TransitionProps={{onExited}}
			aria-labelledby="extract-dialog-title">
			<Title id="extract-dialog-title" disableTypography>
				<Typography variant="h6">Not Enough Credit</Typography>
				<IconButton aria-label="Close" edge="end" onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Typography paragraph color="error">
					Remaining credit: ${user.credit.toFixed(2)}
				</Typography>
				<Typography paragraph color="error">
					Action cost ${transcriptionCost.toFixed(2)}
				</Typography>
				<Typography paragraph>
					Specify a USD amount to add to your account below and pay with paypal. Any amount you add beyond the cost of
					this action will be saved and can be applied to other paid features on VTT Creator. Check your remaining
					credit at any time by clicking the Account button in the lower right corner of the screen.
				</Typography>
				<div>
					<AddCreditInput user={user} defaultValue={defaultValue} onApproved={onPaid} />
				</div>
			</DialogContent>
			<DialogActions>
				<Button name="Cue Extract Cancel" onClick={onClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	)
}
