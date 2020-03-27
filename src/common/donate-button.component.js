import * as React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { styled } from '@material-ui/styles';
import DonationInput from './donation-input.component';
import { Button, useToast } from '../common';
import { createStripeSession } from '../services/rest-api.service';
import { handleError } from '../services/error-handler.service';
import { StripeKey } from '../config';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

export default function DonateButton() {
	const toast = useToast();

	const [donationAmount, setDonationAmount] = React.useState();
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const onDonate = async () => {
		setLoading(true);
		try {
			const { session } = await createStripeSession({
				name: 'Donation',
				description: 'Thanks for your support!',
				amount: Math.round(donationAmount * 100),
			});

			const stripe = Stripe(StripeKey);
			const result = await stripe.redirectToCheckout({ sessionId: session.id });
			if (result.error) throw result.error;
		} catch (e) {
			setLoading(false);
			handleError(e);
			toast.error('Something went wrong!');
		}
	};

	const onOpenDialog = () => {
		setDialogOpen(true);
	};

	const onCloseDialog = () => {
		setDialogOpen(false);
	};

	return (
		<React.Fragment>
			<Button color="secondary" variant="contained" onClick={onOpenDialog}>
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
					<DonationInput value={donationAmount} onChange={e => setDonationAmount(parseFloat(e.target.value))} />
				</DialogContent>
				<DialogActions>
					<Button onClick={onCloseDialog} color="primary">
						Cancel
					</Button>
					<Button
						loading={loading}
						icon={<ShoppingCartIcon />}
						onClick={onDonate}
						color="primary"
						variant="contained"
						disabled={!donationAmount || donationAmount < 1}>
						Checkout
					</Button>
				</DialogActions>
			</Dialog>
		</React.Fragment>
	);
}
