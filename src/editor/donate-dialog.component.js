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
import { Button, DonateButton } from '../common';
import { useDuration } from '../common/video';

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
	const { duration } = useDuration();
	const suggestedDonation = roundToCents(Math.max(1, (duration / 3600) * 2)); // costs about $2 per hour

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
				<Typography paragraph>Hi there, I&apos;m glad you&apos;re enjoying this app!</Typography>
				<Typography paragraph>
					It&apos;s not free to keep this app up and running, and using machine learning to transcribe audio is
					particularly expensive. I&apos;m hoping you&apos;ll help me continue to provide this feature for users like
					you by offering a small donation.
				</Typography>
				<Typography paragraph>
					Based on the length of your video, a donation of ${suggestedDonation.toFixed(2)} would cover the cost of
					transcribing this audio. Will you donate this amount to help me cover this cost? Pretty please? :)
				</Typography>
				<Typography paragraph>
					Thanks!
					<br />
					Rob
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button name="Cue Extract Donate Cancel" onClick={onClose} color="primary">
					Not Now
				</Button>
				<DonateButton
					name="Cue Extract Donate Checkout"
					onClick={onClose}
					icon={<ShoppingCartIcon />}
					color="secondary"
					variant="contained">
					Donate
				</DonateButton>
			</DialogActions>
		</Dialog>
	);
}

function roundToCents(amount) {
	return Math.round(amount * 100) / 100;
}
