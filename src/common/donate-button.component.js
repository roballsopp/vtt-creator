import * as React from 'react';
import MaskedInput from 'react-text-mask';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, styled } from '@material-ui/styles';
import { useToast } from '../common';
import { createStripeSession } from '../services/rest-api.service';
import { StripeKey } from '../config';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

const useStyles = makeStyles({
	donationInput: {
		fontSize: 20,
	},
});

export default function DonateButton() {
	const toast = useToast();
	const classes = useStyles();

	const [donationAmount, setDonationAmount] = React.useState();
	const [dialogOpen, setDialogOpen] = React.useState(false);

	const onDonate = async () => {
		try {
			const { session } = await createStripeSession({ name: 'Donation', amount: Math.round(donationAmount * 100) });

			const stripe = Stripe(StripeKey);
			const result = await stripe.redirectToCheckout({ sessionId: session.id });
			if (result.error) throw result.error;
		} catch (e) {
			console.error(e);
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
					<TextField
						variant="outlined"
						label="Amount"
						helperText="Donation amount must be $1.00 minimum"
						value={donationAmount}
						onChange={e => setDonationAmount(parseFloat(e.target.value))}
						InputProps={{
							startAdornment: <InputAdornment position="start">$</InputAdornment>,
							inputComponent: CustomMaskedInput,
							className: classes.donationInput,
						}}
						placeholder={'5.00'}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={onCloseDialog} color="primary">
						Cancel
					</Button>
					<Button
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

const dollarsMask = input => {
	const [dollars, cents] = input.split('.');
	const mask = ['.'];
	if (dollars) {
		if (dollars.length === 1) {
			mask.unshift(/\d/);
		} else if (dollars.length === 2) {
			mask.unshift(/\d/, /\d/);
		} else {
			mask.unshift(/\d/, /\d/, /\d/);
		}
	} else {
		mask.unshift('0');
	}

	if (cents) {
		if (cents.length === 1) {
			mask.push(/\d/, '0');
		} else {
			mask.push(/\d/, /\d/);
		}
	} else {
		mask.push('0', '0');
	}

	return mask;
};

function CustomMaskedInput({ inputRef, ...props }) {
	return (
		<MaskedInput
			{...props}
			ref={ref => {
				inputRef(ref ? ref.inputElement : null);
			}}
			mask={dollarsMask}
		/>
	);
}
