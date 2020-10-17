import React from 'react';
import PropTypes from 'prop-types';
import { useQuery, gql } from '@apollo/client';
import IconButton from '@material-ui/core/IconButton';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { styled } from '@material-ui/styles';
import { AddCreditInput } from '../../account';
import { Button } from '../../common';
import { useDuration } from '../../common/video';
import { GetTotalCost } from '../../config';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

CreditDialog.fragments = {
	user: gql`
		fragment CreditDialogUser on User {
			id
			credit
			unlimitedUsage
			...AddCreditInputUser
		}
		${AddCreditInput.fragments.user}
	`,
};

CreditDialog.propTypes = {
	user: PropTypes.shape({
		id: PropTypes.string.isRequired,
		credit: PropTypes.number.isRequired,
		unlimitedUsage: PropTypes.bool,
	}).isRequired,
	open: PropTypes.bool,
	onPaid: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
	onExited: PropTypes.func.isRequired,
};

export default function CreditDialog({ user, open, onClose, onPaid, onExited }) {
	const { duration } = useDuration();
	const cost = GetTotalCost(duration);
	const defaultValue = Math.max(cost - user.credit, 1).toFixed(2);

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
				<Typography paragraph color="error">
					Remaining credit: ${user.credit.toFixed(2)}
				</Typography>
				<Typography paragraph color="error">
					Transcription cost ${cost.toFixed(2)}
				</Typography>
				<Typography paragraph>
					Specify a USD amount to add to your account below and pay with paypal. Any amount you add beyond the cost of
					this video will be saved and can be applied to later videos. Check your remaining credit at any time by
					clicking the Account button in the lower right corner of the screen.
				</Typography>
				<div>
					<AddCreditInput user={user} defaultValue={defaultValue} onApproved={onPaid} />
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
