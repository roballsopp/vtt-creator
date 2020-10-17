import React from 'react';
import EventEmitter from 'events';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import * as Sentry from '@sentry/browser';
import { gql, useApolloClient } from '@apollo/client';
import { AuthenticationDetails, CognitoUser } from 'amazon-cognito-identity-js';
import Dialog from '@material-ui/core/Dialog';
import { cognitoUserPool } from '../config';
import { handleError } from '../services/error-handler.service';
import LoginDialog from './LoginDialog';
import ForgotPasswordDialog from './ForgotPasswordDialog';
import PasswordResetDialog from './PasswordResetDialog';
import SignUpDialog from './SignUpDialog';
import VerifyEmailDialog from './VerifyEmailDialog';
import EmailVerifiedDialog from './EmailVerifiedDialog';
import { AuthDialogContext } from './auth-dialog-context';

AuthDialogProvider.propTypes = {
	children: PropTypes.node.isRequired,
};

export function AuthDialogProvider({ children }) {
	const history = useHistory();
	const apolloClient = useApolloClient();
	const params = new URLSearchParams(history.location.search);
	const viewId = params.get('authDialog');
	const email = params.get('email');
	const authEventsRef = React.useRef(new EventEmitter());
	const [loginMessage, setLoginMessage] = React.useState('');

	const handleOpenLoginDialog = React.useCallback(
		msg => {
			setLoginMessage(msg);
			history.push(`${history.location.pathname}?authDialog=LOGIN`);
		},
		[history]
	);

	const handleOpenSignUpDialog = React.useCallback(() => {
		setLoginMessage('');
		history.push(`${history.location.pathname}?authDialog=SIGNUP`);
	}, [history]);

	const handleOpenForgotPasswordDialog = React.useCallback(() => {
		setLoginMessage('');
		history.push(`${history.location.pathname}?authDialog=FORGOT_PWD`);
	}, [history]);

	const handleOpenPasswordResetDialog = React.useCallback(
		user => {
			setLoginMessage('');
			const email = encodeURIComponent(user.getUsername());
			history.push(`${history.location.pathname}?authDialog=RESET_PWD&email=${email}`);
		},
		[history]
	);

	const handleOpenVerifyEmailDialog = React.useCallback(
		user => {
			setLoginMessage('');
			const email = encodeURIComponent(user.getUsername());
			history.push(`${history.location.pathname}?authDialog=VERIFY_EMAIL&email=${email}`);
		},
		[history]
	);

	const handleOpenEmailVerifiedDialog = React.useCallback(() => {
		setLoginMessage('');
		history.push(`${history.location.pathname}?authDialog=EMAIL_VERIFIED`);
	}, [history]);

	const handleCloseDialog = React.useCallback(() => {
		setLoginMessage('');
		history.push(`${history.location.pathname}`);
	}, [history]);

	const handleLogin = React.useCallback(
		(email, password) => {
			return new Promise((resolve, reject) => {
				const cognitoUser = new CognitoUser({ Username: email, Pool: cognitoUserPool });
				cognitoUser.authenticateUser(new AuthenticationDetails({ Username: email, Password: password }), {
					onSuccess: function() {
						cognitoUser.getUserData((err, data) => {
							if (err) {
								authEventsRef.current.emit('login-fail', err);
								handleError(err);
								return reject(err);
							}

							const user = data.UserAttributes.reduce((user, att) => {
								user[att.Name] = att.Value;
								return user;
							}, {});

							const graphUser = {
								id: user.sub,
								email: user.email,
								credit: Number(user['custom:credit'] || 0),
								unlimitedUsage: user['custom:unlimited_usage'] === 'true',
								lastOrderDate: user['custom:last_order_date'] && new Date(user['custom:last_order_date']),
								__typename: 'User',
							};

							Sentry.setUser(graphUser);

							apolloClient.writeQuery({
								query: gql`
									query {
										self {
											id
											email
											credit
											unlimitedUsage
										}
									}
								`,
								data: {
									self: graphUser,
								},
							});

							authEventsRef.current.emit('login');
							resolve();
							handleCloseDialog();
						});
					},
					onFailure: err => {
						authEventsRef.current.emit('login-fail', err);
						handleError(err);
						reject(err);
					},
				});
			});
		},
		[apolloClient, handleCloseDialog]
	);

	const handleLogout = React.useCallback(() => {
		return new Promise((resolve, reject) => {
			const cognitoUser = cognitoUserPool.getCurrentUser();
			if (cognitoUser) {
				cognitoUser.signOut();
			}
			// totally blast the store and retrigger queries so ui updates to "not logged in" mode
			apolloClient
				.resetStore()
				.then(() => {
					authEventsRef.current.emit('logout');
					resolve();
					handleCloseDialog();
				})
				.catch(reject);
		});
	}, [apolloClient, handleCloseDialog]);

	const handleSignUp = React.useCallback(
		(email, password) => {
			return new Promise((resolve, reject) => {
				cognitoUserPool.signUp(email, password, [], null, (err, result) => {
					if (err) {
						authEventsRef.current.emit('signup-fail', err);
						handleError(err);
						return reject(err);
					}
					resolve(result.user);
					handleOpenVerifyEmailDialog(result.user);
				});
			});
		},
		[handleOpenVerifyEmailDialog]
	);

	const handleVerifyEmail = React.useCallback(
		code => {
			return new Promise((resolve, reject) => {
				const cognitoUser = new CognitoUser({ Username: email, Pool: cognitoUserPool });
				cognitoUser.confirmRegistration(code, false, function(err) {
					if (err) {
						handleError(err);
						return reject(err);
					}
					resolve();
					handleOpenEmailVerifiedDialog();
				});
			});
		},
		[email, handleOpenEmailVerifiedDialog]
	);

	const handleSendResetCode = React.useCallback(
		email => {
			return new Promise((resolve, reject) => {
				const cognitoUser = new CognitoUser({ Username: email, Pool: cognitoUserPool });
				cognitoUser.forgotPassword({
					onSuccess: function() {
						resolve();
						handleOpenPasswordResetDialog(cognitoUser);
					},
					onFailure: function(err) {
						handleError(err);
						reject(err);
					},
				});
			});
		},
		[handleOpenPasswordResetDialog]
	);

	const handleResendCode = React.useCallback(() => {
		return new Promise((resolve, reject) => {
			const cognitoUser = new CognitoUser({ Username: email, Pool: cognitoUserPool });
			cognitoUser.resendConfirmationCode(function(err) {
				if (err) {
					handleError(err);
					return reject(err);
				}
				resolve();
			});
		});
	}, [email]);

	const handleResetPassword = React.useCallback(
		(code, newPassword) => {
			return new Promise((resolve, reject) => {
				const cognitoUser = new CognitoUser({ Username: email, Pool: cognitoUserPool });
				cognitoUser.confirmPassword(code, newPassword, {
					onSuccess() {
						resolve();
						handleOpenLoginDialog();
					},
					onFailure(err) {
						reject(err);
						authEventsRef.current.emit('password-reset-fail', err);
						handleError(err);
					},
				});
			});
		},
		[email, handleOpenLoginDialog]
	);

	const handleExited = React.useCallback(() => {
		authEventsRef.current.emit('exited');
	}, []);

	return (
		<AuthDialogContext.Provider
			value={{
				openLoginDialog: handleOpenLoginDialog,
				openSignupDialog: handleOpenSignUpDialog,
				openForgotPasswordDialog: handleOpenForgotPasswordDialog,
				openPasswordResetDialog: handleOpenPasswordResetDialog,
				openVerifyEmailDialog: handleOpenVerifyEmailDialog,
				openEmailVerifiedDialog: handleOpenEmailVerifiedDialog,
				login: handleLogin,
				logout: handleLogout,
				signup: handleSignUp,
				verifyEmail: handleVerifyEmail,
				sendResetCode: handleSendResetCode,
				resendCode: handleResendCode,
				resetPassword: handleResetPassword,
				closeDialog: handleCloseDialog,
				authDialogEvents: authEventsRef.current,
			}}>
			{children}
			<Dialog
				disableBackdropClick
				disableEscapeKeyDown
				maxWidth="xs"
				fullWidth
				open={Boolean(viewId)}
				onClose={handleCloseDialog}
				onExited={handleExited}
				aria-labelledby="auth-dialog">
				{viewId === 'LOGIN' && <LoginDialog errorMessage={loginMessage} />}
				{viewId === 'FORGOT_PWD' && <ForgotPasswordDialog />}
				{viewId === 'RESET_PWD' && <PasswordResetDialog />}
				{viewId === 'SIGNUP' && <SignUpDialog />}
				{viewId === 'VERIFY_EMAIL' && <VerifyEmailDialog />}
				{viewId === 'EMAIL_VERIFIED' && <EmailVerifiedDialog />}
			</Dialog>
		</AuthDialogContext.Provider>
	);
}
