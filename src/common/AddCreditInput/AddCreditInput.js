import React from 'react'
import PropTypes from 'prop-types'
import {Box, Button, CircularProgress, Typography} from '@material-ui/core'
import EmailIcon from '@material-ui/icons/Email'
import {makeStyles} from '@material-ui/styles'
import {handleError} from '../../services/error-handler.service'
import PaypalButtons from './PaypalButtons'
import DollarsInput from './DollarsInput'
import {useUser} from '../UserContext'

const useStyles = makeStyles(theme => ({
	loader: {
		display: 'flex',
		alignItems: 'center',
		height: 75,
		marginTop: theme.spacing(4),
		marginBottom: theme.spacing(4),
	},
	spinner: {
		marginRight: theme.spacing(4),
	},
}))

AddCreditInput.propTypes = {
	defaultValue: PropTypes.string,
	onApproved: PropTypes.func,
	onError: PropTypes.func,
}

export default function AddCreditInput({defaultValue, onApproved, onError}) {
	const [purchaseAmt, setPurchaseAmt] = React.useState(defaultValue || '')
	const [paypalError, setPaypalError] = React.useState(false)
	const [cardError, setCardError] = React.useState(false)
	const [inputErr, setInputError] = React.useState(false)
	const [awaitingApproval, setAwaitingApproval] = React.useState(false)

	const classes = useStyles()

	const handlePaypalError = err => {
		setAwaitingApproval(false)
		setPaypalError(true)
		handleError(err)
		onError(err)
	}

	const handleChangePurchaseAmt = amt => {
		setPurchaseAmt(amt)
		const amtNum = Number(amt)
		setInputError(Number.isNaN(amtNum) || amtNum < 1)
	}

	const handleApproveStart = () => {
		setPaypalError(false)
		setCardError(false)
		setAwaitingApproval(true)
	}

	const handleApproved = data => {
		setAwaitingApproval(false)
		if (!data.paypalErrorCode) {
			onApproved?.()
		} else {
			switch (data.paypalErrorCode) {
				case 'INSTRUMENT_DECLINED':
					return setCardError(true)
				default:
					return setPaypalError(true)
			}
		}
	}

	const mailTo = useMailTo()

	return (
		<React.Fragment>
			{paypalError && (
				<Box mb={4}>
					<Typography variant="subtitle2" color="error" paragraph>
						There was an error accepting your payment. Please send us an email so we can take a look and fix any issues.
					</Typography>
					<Button href={mailTo} variant="contained" color="primary" startIcon={<EmailIcon />}>
						Report Issue
					</Button>
				</Box>
			)}
			{cardError && (
				<Typography variant="subtitle2" color="error" paragraph>
					Your payment was declined. Please select another form of payment.
				</Typography>
			)}
			<Typography variant="subtitle2" gutterBottom>
				Add Credit:
			</Typography>
			{awaitingApproval && (
				<div className={classes.loader}>
					<CircularProgress className={classes.spinner} />
					<Typography variant="h6">Waiting for order to complete...</Typography>
				</div>
			)}
			{!awaitingApproval && (
				<DollarsInput defaultValue={defaultValue} error={inputErr} onChange={handleChangePurchaseAmt} />
			)}
			<PaypalButtons
				disabled={inputErr || !purchaseAmt || awaitingApproval}
				purchaseAmt={purchaseAmt}
				onError={handlePaypalError}
				onApprove={handleApproveStart}
				onApproved={handleApproved}
			/>
		</React.Fragment>
	)
}

function useMailTo() {
	const {user} = useUser()

	if (!user) return `mailto:vttcreator@gmail.com`

	const subject = encodeURIComponent(`Payment Error - User: ${user.email}`)
	const body = encodeURIComponent(`\n\nError Info\nAccount Email: ${user.email}\nDate: ${new Date().toISOString()}`)
	return `mailto:vttcreator@gmail.com?subject=${subject}&body=${body}`
}
