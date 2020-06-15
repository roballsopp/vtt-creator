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
import { Button } from '../common';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

export default function DonateButton() {
	const [donationAmount, setDonationAmount] = React.useState();
	const [dialogOpen, setDialogOpen] = React.useState(false);

	const onDonate = async () => {
		window.open(`${window.location.origin}/checkout?donationAmount=${donationAmount}`, '_blank');
		onCloseDialog();
	};

	const onOpenDialog = () => {
		setDialogOpen(true);
	};

	const onCloseDialog = () => {
		setDialogOpen(false);
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
					<DonationInput value={donationAmount} onChange={e => setDonationAmount(parseFloat(e.target.value))} />
				</DialogContent>
				<DialogActions>
					<Button name="Donation Cancel" onClick={onCloseDialog} color="primary">
						Cancel
					</Button>
					<Button
						name="Donation Checkout"
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
