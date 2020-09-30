import EmailIcon from '@material-ui/icons/Email';
import * as React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { handleError } from '../services/error-handler.service';
import PaypalButtons from './PaypalButtons';
import DollarsInput from './DollarsInput';

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
	onApprove: PropTypes.func,
};

export default function AddCreditInput({ user, defaultValue, onApprove }) {
	const [purchaseAmt, setPurchaseAmt] = React.useState(defaultValue || '');
	const [paypalError, setPaypalError] = React.useState(false);
	const [inputErr, setInputError] = React.useState(false);

	const handlePaypalError = err => {
		setPaypalError(true);
		handleError(err);
	};

	const handleChangePurchaseAmt = amt => {
		setPurchaseAmt(amt);
		const amtNum = Number(amt);
		setInputError(Number.isNaN(amtNum) || amtNum < 1);
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
			<DollarsInput defaultValue={defaultValue} error={inputErr} onChange={handleChangePurchaseAmt} />
			<PaypalButtons
				disabled={inputErr || !purchaseAmt}
				purchaseAmt={purchaseAmt}
				onError={handlePaypalError}
				onApprove={onApprove}
			/>
		</React.Fragment>
	);
}
