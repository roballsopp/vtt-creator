import EmailIcon from '@material-ui/icons/Email';
import * as React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/styles';
import { handleError } from '../services/error-handler.service';
import PaypalButtons from './PaypalButtons';
import DollarsInput from './DollarsInput';

const useStyles = makeStyles(theme => ({
	loader: {
		display: 'flex',
		alignItems: 'center',
		height: 75,
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
	},
	spinner: {
		marginRight: theme.spacing(2),
	},
}));

AddCreditInput.fragments = {
	user: gql`
		fragment AddCreditInputUser on User {
			id
			email
			credit
		}
	`,
};

AddCreditInput.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
		email: PropTypes.string.isRequired,
		credit: PropTypes.number.isRequired,
	}).isRequired,
	defaultValue: PropTypes.string,
	onApproved: PropTypes.func,
	onError: PropTypes.func,
};

export default function AddCreditInput({ user, defaultValue, onApproved, onError }) {
	const [purchaseAmt, setPurchaseAmt] = React.useState(defaultValue || '');
	const [paypalError, setPaypalError] = React.useState(false);
	const [inputErr, setInputError] = React.useState(false);
	const [awaitingApproval, setAwaitingApproval] = React.useState(false);

	const classes = useStyles();

	const handlePaypalError = err => {
		setAwaitingApproval(false);
		setPaypalError(true);
		handleError(err);
		onError(err);
	};

	const handleChangePurchaseAmt = amt => {
		setPurchaseAmt(amt);
		const amtNum = Number(amt);
		setInputError(Number.isNaN(amtNum) || amtNum < 1);
	};

	const handleApproveStart = () => {
		setAwaitingApproval(true);
	};

	const handleApproved = () => {
		setAwaitingApproval(false);
		if (onApproved) onApproved();
	};

	if (paypalError) {
		const subject = encodeURIComponent(`Payment Error - User: ${user.email}`);
		const body = encodeURIComponent(`\n\nError Info\nAccount Email: ${user.email}\nDate: ${new Date().toISOString()}`);
		const mailto = `mailto:vttcreator@gmail.com?subject=${subject}&body=${body}`;
		return (
			<React.Fragment>
				<Typography variant="subtitle2" color="error" gutterBottom>
					There was an error accepting your payment. Please send us an email so we can take a look and fix any issues.
				</Typography>
				<Button href={mailto} variant="contained" color="primary" startIcon={<EmailIcon />}>
					Report Issue
				</Button>
			</React.Fragment>
		);
	}

	return (
		<React.Fragment>
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
	);
}
