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
import { Button, useAuth } from '../common';
import { LoginUrl, SignupUrl, TranscriptionCost } from '../config';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

LoginDialog.propTypes = {
	open: PropTypes.bool,
	onExited: PropTypes.func.isRequired,
	onClose: PropTypes.func.isRequired,
};

export default function LoginDialog({ open, onExited, onClose }) {
	const { isAuthenticated } = useAuth();

	React.useEffect(() => {
		if (isAuthenticated) onClose();
	}, [isAuthenticated, onClose]);

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
				<Typography variant="h6">Account Required</Typography>
				<IconButton aria-label="Close" edge="end" onClick={onClose}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Typography paragraph>Hi there, I&apos;m glad you&apos;re enjoying this app!</Typography>
				<Typography paragraph>
					Unfortunately I can no longer afford to keep the automatic caption extraction feature free. You&apos;ll now
					have to create an account and buy credits to extract captions from your videos. Have no fear though! The cost
					is only ${TranscriptionCost.toFixed(2)} per minute of video! Please login or sign up for an account below.
				</Typography>
				<Typography paragraph>
					Thanks!
					<br />
					Rob
				</Typography>
			</DialogContent>
			<DialogActions>
				<Button name="Cue Extract Cancel" onClick={onClose} color="primary">
					Cancel
				</Button>
				<Button name="Login" color="secondary" variant="contained" href={LoginUrl} target="_blank">
					Login
				</Button>
				<Button name="Signup" color="secondary" variant="contained" href={SignupUrl} target="_blank">
					Sign Up
				</Button>
			</DialogActions>
		</Dialog>
	);
}
