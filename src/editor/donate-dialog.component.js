import * as React from 'react';
import * as PropTypes from 'prop-types';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { styled } from '@material-ui/styles';
import { Button, DonationInput, useToast } from '../common';
import { useDuration } from '../common/video';
import { createStripeSession } from '../services/rest-api.service';
import { handleError } from '../services/error-handler.service';
import { StripeKey } from '../config';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

DonateDialog.propTypes = {
	open: PropTypes.bool,
	onClose: PropTypes.func.isRequired,
};

export default function DonateDialog({ open, onClose }) {
	const toast = useToast();
	const { duration } = useDuration();
	const suggestedDonation = roundToMinimum((duration / 3600) * 2); // costs about $2 per hour

	const [donationAmount, setDonationAmount] = React.useState(suggestedDonation);
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

	return (
		<Dialog
			disableBackdropClick
			disableEscapeKeyDown
			maxWidth="sm"
			fullWidth
			open={open}
			onClose={onClose}
			aria-labelledby="extract-dialog-title">
			<Title id="extract-dialog-title" disableTypography>
				<Typography variant="h6">Help Keep This App Running</Typography>
				<IconButton aria-label="Close" edge="end" onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Typography paragraph>
					Hi there, I&apos;m glad you&apos;ve been enjoying this app! It&apos;s not free to keep this app up and
					running, and extracting text captions right from the audio embedded in your video as you are about to do is
					particularly expensive to provide everyone access to. I&apos;m hoping you&apos;ll help me continue to provide
					users of this site, including you, access to this great feature by offering a small donation.
				</Typography>
				<Typography paragraph>
					Based on the length of your video, a donation of ${suggestedDonation.toFixed(2)} would cover the cost of
					transcribing this audio. Will you donate this amount to help me cover this cost? Pretty please? :)
				</Typography>
				<DonationInput value={donationAmount} onChange={e => setDonationAmount(parseFloat(e.target.value))} />
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} color="primary">
					Not Now
				</Button>
				<Button
					loading={loading}
					icon={<ShoppingCartIcon />}
					onClick={onDonate}
					color="primary"
					variant="contained"
					disabled={!donationAmount || donationAmount < 1}>
					Donate
				</Button>
			</DialogActions>
		</Dialog>
	);
}

function roundToMinimum(donation) {
	return donation < 1 ? 1 : donation;
}
