import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
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

ForgotPasswordDialog.propTypes = {};

export default function ForgotPasswordDialog() {
	const [email, setEmail] = React.useState('');
	const [sendCodeFailed, setSendCodeFailed] = React.useState(false);
	const [loading, setLoading] = React.useState(false);

	const { sendResetCode, closeDialog } = useAuthDialog();

	const handleChangeEmail = e => {
		setEmail(e.target.value);
	};

	const handleReset = () => {
		setLoading(true);
		sendResetCode(email).catch(() => {
			setLoading(false);
			setSendCodeFailed(true);
		});
	};

	return (
		<React.Fragment>
			<Title disableTypography>
				<Typography variant="h6">Reset Your Password</Typography>
				<IconButton aria-label="Close" edge="end" onClick={closeDialog}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Grid container spacing={4} direction="column">
					{sendCodeFailed && (
						<Grid item>
							<Typography color="error">Something went wrong while sending your code. Please try again.</Typography>
						</Grid>
					)}
					<Grid item>
						<Typography>Enter your email below and we&apos;ll send you a code to reset your password.</Typography>
					</Grid>
					<Grid item>
						<TextField
							variant="outlined"
							type="email"
							label="Email"
							value={email}
							fullWidth
							onChange={handleChangeEmail}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeDialog} color="primary">
					Cancel
				</Button>
				{!email && (
					<Tooltip title="Please enter your email.">
						<span>
							<Button color="secondary" variant="contained" disabled>
								Reset my password
							</Button>
						</span>
					</Tooltip>
				)}
				{email && (
					<Button color="secondary" variant="contained" loading={loading} onClick={handleReset}>
						Reset my password
					</Button>
				)}
			</DialogActions>
		</React.Fragment>
	);
}
