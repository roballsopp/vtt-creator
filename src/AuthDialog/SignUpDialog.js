import React from 'react';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import CloseIcon from '@material-ui/icons/Close';
import VisibilityIcon from '@material-ui/icons/Visibility';
import VisibilityOffIcon from '@material-ui/icons/VisibilityOff';
import { styled } from '@material-ui/styles';
import { useAuthDialog } from './auth-dialog-context';
import usePasswordValidation from './usePasswordValidation';
import { Button } from '../common';
import ValidationText from './ValidationText';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

SignUpDialog.propTypes = {};

export default function SignUpDialog() {
	const [email, setEmail] = React.useState('');
	const [password, setPassword] = React.useState('');
	const [showPassword, setShowPassword] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState('');

	const { signup, closeDialog } = useAuthDialog();

	const passwordValidation = usePasswordValidation(password);

	const handleChangeEmail = e => {
		setEmail(e.target.value);
	};

	const handleChangePassword = e => {
		setPassword(e.target.value);
	};

	const handleToggleShowPassword = () => {
		setShowPassword(s => !s);
	};

	const handleSignUp = () => {
		setLoading(true);
		signup(email, password).catch(err => {
			setLoading(false);
			setError(err.message);
		});
	};

	return (
		<React.Fragment>
			<Title disableTypography>
				<Typography variant="h6">Sign up</Typography>
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
					<Grid item>
						<Typography>Create a new account by entering a valid email address and password.</Typography>
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
					<Grid item>
						<TextField
							variant="outlined"
							type={showPassword ? 'text' : 'password'}
							label="Password"
							value={password}
							error={!passwordValidation.isValid}
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
						<ValidationText valid={passwordValidation.hasLowercase}>
							Password must contain a lower case letter
						</ValidationText>
						<ValidationText valid={passwordValidation.hasUppercase}>
							Password must contain an upper case letter
						</ValidationText>
						<ValidationText valid={passwordValidation.hasNumber}>Password must contain a number</ValidationText>
						<ValidationText valid={passwordValidation.hasMinLength}>
							Password must contain at least 8 characters
						</ValidationText>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={closeDialog} color="primary">
					Cancel
				</Button>
				{!(passwordValidation.isValid && email) && (
					<Tooltip title="Please enter a valid email and password.">
						<span>
							<Button color="secondary" variant="contained" disabled>
								Sign up
							</Button>
						</span>
					</Tooltip>
				)}
				{passwordValidation.isValid && email && (
					<Button color="secondary" variant="contained" loading={loading} onClick={handleSignUp}>
						Sign up
					</Button>
				)}
			</DialogActions>
		</React.Fragment>
	);
}
