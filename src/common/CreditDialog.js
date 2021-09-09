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
import Button from './button.component'
import AddCreditInput from './AddCreditInput'
import {useUser} from './UserContext'

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
})

CreditDialog.propTypes = {
	cost: PropTypes.number.isRequired,
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onExited: PropTypes.func.isRequired,
}

export default function CreditDialog({cost, open, onClose, onExited}) {
	const justPaid = React.useRef(false)

	function handleClose(e, reason) {
		if (['backdropClick', 'escapeKeyDown'].includes(reason)) {
			return
		}
		onClose()
	}

	function handlePaid() {
		justPaid.current = true
		onClose()
	}

	function handleExited() {
		onExited(justPaid.current)
		justPaid.current = false
	}

	const {userLoading, user} = useUser()

	if (userLoading || !user) return null

	const defaultValue = Math.max(cost - user.credit, 1).toFixed(2)

	return (
		<Dialog
			maxWidth="sm"
			fullWidth
			open={open}
			onClose={handleClose}
			TransitionProps={{onExited: handleExited}}
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
					Action cost ${cost.toFixed(2)}
				</Typography>
				<Typography paragraph>Specify a USD amount to add to your account below and pay with paypal.</Typography>
				<Typography paragraph>
					Any amount you add beyond the cost of this action will be saved and can be applied to other paid features on
					VTT Creator.
				</Typography>
				<Typography paragraph>
					Check your remaining credit at any time by visiting the Account page using the navigation menu in the top left
					of the screen.
				</Typography>
				<div>
					<AddCreditInput defaultValue={defaultValue} onApproved={handlePaid} />
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
