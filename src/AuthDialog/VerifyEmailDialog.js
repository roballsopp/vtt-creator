import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles, styled } from '@material-ui/styles';
import { Button } from '../common';
import { useAuthDialog } from './auth-dialog-context';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

const useStyles = makeStyles({
	link: {
		cursor: 'pointer',
	},
	goodMessage: {
		color: 'green',
	},
});

VerifyEmailDialog.propTypes = {};

export default function VerifyEmailDialog() {
	const [code, setCode] = React.useState('');
	const [error, setError] = React.useState(false);
	const [codeSent, setCodeSent] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const classes = useStyles();

	const { verifyEmail, resendCode, closeDialog } = useAuthDialog();

	const handleChangeCode = e => {
		setCode(e.target.value);
	};

	const handleVerification = () => {
		setLoading(true);
		verifyEmail(code).catch(err => {
			setLoading(false);
			setError(err.message);
			setCodeSent(false);
		});
	};

	const handleResendCode = () => {
		resendCode()
			.then(() => {
				setCodeSent(true);
				setError(false);
			})
			.catch(err => {
				setError(err.message);
				setCodeSent(false);
			});
	};

	return (
		<React.Fragment>
			<Title disableTypography>
				<Typography variant="h6">Verify Email</Typography>
				<IconButton aria-label="Close" edge="end" onClick={closeDialog}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Grid container spacing={2} direction="column">
					{error && (
						<Grid item>
							<Typography color="error">{error}</Typography>
						</Grid>
					)}
					{codeSent && (
						<Grid item>
							<Typography className={classes.goodMessage}>
								We just sent your verification code. Check your inbox!
							</Typography>
						</Grid>
					)}
					<Grid item>
						<Typography>Enter your verification code below.</Typography>
					</Grid>
					<Grid item>
						<TextField
							variant="outlined"
							label="Verification Code"
							value={code}
							fullWidth
							onChange={handleChangeCode}
						/>
					</Grid>
					<Grid item>
						<Typography align="center">
							Didn&apos;t receive a code?{' '}
							<Link className={classes.link} onClick={handleResendCode}>
								Resend it
							</Link>
						</Typography>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeDialog} color="primary">
					Cancel
				</Button>
				{!code && (
					<Tooltip title="Please enter your verification code.">
						<span>
							<Button color="secondary" variant="contained" disabled>
								Verify Email
							</Button>
						</span>
					</Tooltip>
				)}
				{code && (
					<Button color="secondary" variant="contained" loading={loading} onClick={handleVerification}>
						Verify Email
					</Button>
				)}
			</DialogActions>
		</React.Fragment>
	);
}
