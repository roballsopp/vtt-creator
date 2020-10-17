import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { styled } from '@material-ui/styles';
import { Button } from '../common';
import { useAuthDialog } from './auth-dialog-context';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

EmailVerifiedDialog.propTypes = {};

export default function EmailVerifiedDialog() {
	const { openLoginDialog, closeDialog } = useAuthDialog();

	const handleGoToLogin = () => {
		openLoginDialog();
	};

	return (
		<React.Fragment>
			<Title disableTypography>
				<Typography variant="h6">Email Verified</Typography>
				<IconButton aria-label="Close" edge="end" onClick={closeDialog}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Grid container spacing={2} direction="column">
					<Grid item>
						<Typography>Great, your email has been verified! You can now login and continue working.</Typography>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button color="secondary" variant="contained" onClick={handleGoToLogin}>
					Go to Login
				</Button>
			</DialogActions>
		</React.Fragment>
	);
}
