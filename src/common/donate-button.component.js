import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { styled, makeStyles } from '@material-ui/styles';
import DonationInput from './donation-input.component';
import { Button, PayPalButton } from '../common';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

const useStyles = makeStyles(theme => ({
	paymentButtonContainer: {
		marginTop: theme.spacing(3),
	},
}));

export default function DonateButton() {
	const [donationAmount, setDonationAmount] = React.useState('1.00');
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const classes = useStyles();

	const onOpenDialog = () => {
		setDialogOpen(true);
	};

	const onCloseDialog = () => {
		setDialogOpen(false);
	};

	const handlePaypalSuccess = () => {
		onCloseDialog();
	};

	return (
		<React.Fragment>
			<Button name="Donate Footer" color="secondary" variant="contained" onClick={onOpenDialog}>
				Donate
			</Button>
			<Dialog
				disableBackdropClick
				disableEscapeKeyDown
				maxWidth="sm"
				fullWidth
				open={dialogOpen}
				onClose={onCloseDialog}
				aria-labelledby="extract-dialog-title">
				<Title id="extract-dialog-title" disableTypography>
					<Typography variant="h6">Donate</Typography>
					<IconButton aria-label="Close" edge="end" onClick={onCloseDialog}>
						<CloseIcon />
					</IconButton>
				</Title>
				<DialogContent>
					<Typography paragraph>Thanks for supporting this project! How much would you like to give?</Typography>
					<DonationInput value={donationAmount} onChange={setDonationAmount} />
					<div className={classes.paymentButtonContainer}>
						<PayPalButton name="PayPal Donate" paymentAmount={donationAmount} onPaymentSuccess={handlePaypalSuccess} />
					</div>
				</DialogContent>
				<DialogActions>
					<Button name="Donation Cancel" onClick={onCloseDialog} color="primary">
						Cancel
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
