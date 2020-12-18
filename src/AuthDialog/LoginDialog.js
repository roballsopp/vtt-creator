import React from 'react';
import PropTypes from 'prop-types';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Link from '@material-ui/core/Link';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { styled, makeStyles } from '@material-ui/styles';
import { useAuthDialog } from './auth-dialog-context';
import { Button } from '../common';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

const useStyles = makeStyles({
	link: {
		cursor: 'pointer',
	},
});

LoginDialog.propTypes = {
	errorMessage: PropTypes.string,
};

export default function LoginDialog({ errorMessage }) {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [showPassword, setShowPassword] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState('');

	React.useEffect(() => {
		setError(errorMessage);
	}, [errorMessage]);

	const { login, closeDialog, openSignupDialog, openForgotPasswordDialog } = useAuthDialog();

	const classes = useStyles();

	const handleChangeEmail = e => {
		setEmail(e.target.value);
	};

	const handleChangePassword = e => {
		setPassword(e.target.value);
	};

	const handleToggleShowPassword = () => {
		setShowPassword(s => !s);
	};

	const handleLogin = () => {
		setLoading(true);
		login(email, password).catch(() => {
			setLoading(false);
			setError('Incorrect username or password. Please try again.');
		});
	};

	return (
		<React.Fragment>
			<Title disableTypography>
				<Typography variant="h6">Login</Typography>
				<IconButton aria-label="Close" edge="end" onClick={closeDialog}>
					<CloseIcon />
				</IconButton>
			</Title>
			<DialogContent>
				<Grid container spacing={4} direction="column">
					{error && (
						<Grid item>
							<Typography color="error">{error}</Typography>
						</Grid>
					)}
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
					<Grid item>
						<TextField
							variant="outlined"
							type={showPassword ? 'text' : 'password'}
							label="Password"
							value={password}
							fullWidth
							onChange={handleChangePassword}
							InputProps={{
								endAdornment: (
									<InputAdornment position="end">
										<IconButton edge="end" aria-label="toggle password visibility" onClick={handleToggleShowPassword}>
											{showPassword ? <VisibilityIcon /> : <VisibilityOffIcon />}
										</IconButton>
									</InputAdornment>
								),
							}}
						/>
					</Grid>
					<Grid item>
						<Typography>
							<Link className={classes.link} onClick={openForgotPasswordDialog}>
								Forgot your password?
							</Link>
						</Typography>
					</Grid>
					<Grid item>
						<Typography align="center">
							Don&apos;t have an account?{' '}
							<Link className={classes.link} onClick={openSignupDialog}>
								Sign Up
							</Link>
						</Typography>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeDialog} color="primary">
					Cancel
				</Button>
				{!(email && password) && (
					<Tooltip title="Please enter your email and password above.">
						<span>
							<Button color="secondary" variant="contained" disabled>
								Login
							</Button>
						</span>
					</Tooltip>
				)}
				{email && password && (
					<Button color="secondary" variant="contained" loading={loading} onClick={handleLogin}>
						Login
					</Button>
				)}
			</DialogActions>
		</React.Fragment>
	);
}
