import React from 'react';
import PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { styled } from '@material-ui/styles';
import DollarsInput from '../account/DollarsInput';
import PaypalButtons from '../account/PaypalButtons';
import { Button, useCredit } from '../common';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

CreditDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
	onExited: PropTypes.func.isRequired,
};

export default function CreditDialog({ open, onClose, onExited }) {
	const { cost, credit } = useCredit();
	const [purchaseAmt, setPurchaseAmt] = React.useState('');

	return (
		<Dialog
			disableBackdropClick
			disableEscapeKeyDown
			maxWidth="sm"
			fullWidth
			open={open}
			onClose={onClose}
			onExited={onExited}
			aria-labelledby="extract-dialog-title">
			<Title id="extract-dialog-title" disableTypography>
				<Typography variant="h6">Not Enough Credit</Typography>
				<IconButton aria-label="Close" edge="end" onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Typography paragraph>Remaining credit: ${credit.toFixed(2)}</Typography>
				<Typography paragraph>Transcription cost ${cost.toFixed(2)}</Typography>
				<Typography paragraph>Specify a USD amount to add to your account below and pay with paypal:</Typography>
				<div>
					<Typography variant="subtitle2" gutterBottom>
						Amount to add:
					</Typography>
					<DollarsInput onChange={setPurchaseAmt} />
					<PaypalButtons purchaseAmt={purchaseAmt} onApprove={onClose} />
				</div>
			</DialogContent>
			<DialogActions>
				<Button name="Cue Extract Cancel" onClick={onClose} color="primary">
					Cancel
				</Button>
			</DialogActions>
		</Dialog>
	);
}
