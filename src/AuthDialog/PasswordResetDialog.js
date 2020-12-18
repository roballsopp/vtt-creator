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
import ValidationText from './ValidationText';
import { Button } from '../common';

const Title = styled(DialogTitle)({
	display: 'flex',
	justifyContent: 'space-between',
	alignItems: 'center',
});

PasswordResetDialog.propTypes = {};

export default function PasswordResetDialog() {
	const [code, setCode] = React.useState('');
	const [newPassword, setNewPassword] = React.useState('');
	const [showPassword, setShowPassword] = React.useState(false);
	const [loading, setLoading] = React.useState(false);
	const [error, setError] = React.useState('');
	const passwordValidation = usePasswordValidation(newPassword);

	const { resetPassword, closeDialog } = useAuthDialog();

	const handleChangeCode = e => {
		setCode(e.target.value);
	};

	const handleChangePassword = e => {
		setNewPassword(e.target.value);
	};

	const handleToggleShowPassword = () => {
		setShowPassword(s => !s);
	};

	const handleSubmit = () => {
		setLoading(true);
		resetPassword(code, newPassword).catch(err => {
			setError(err.message);
			setLoading(false);
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
					<Grid item>
						<Typography>
							If you&apos;re registered with VTT Creator, you&apos;ll receive a code in your email inbox shortly. Enter
							it below to reset your password.
						</Typography>
					</Grid>
					{error && (
						<Grid item>
							<Typography color="error">{error}</Typography>
						</Grid>
					)}
					<Grid item>
						<TextField variant="outlined" label="Code" value={code} fullWidth onChange={handleChangeCode} />
					</Grid>
					<Grid item>
						<TextField
							variant="outlined"
							type={showPassword ? 'text' : 'password'}
							label="Password"
							value={newPassword}
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
				{!(passwordValidation.isValid && code) && (
					<Tooltip title="You must enter a code, and your password must meet all the required rules.">
						<span>
							<Button color="secondary" variant="contained" disabled>
								Change Password
							</Button>
						</span>
					</Tooltip>
				)}
				{passwordValidation.isValid && code && (
					<Button color="secondary" variant="contained" loading={loading} onClick={handleSubmit}>
						Change Password
					</Button>
				)}
			</DialogActions>
		</React.Fragment>
	);
}
