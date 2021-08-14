import React from 'react'
import EventEmitter from 'events'
import PropTypes from 'prop-types'
import * as Sentry from '@sentry/browser'
import {gql, useApolloClient} from '@apollo/client'
import qs from 'qs'
import {AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js'
import Dialog from '@material-ui/core/Dialog'
import {cognitoUserPool} from '../cognito'
import {ApiURL} from '../config'
import {CreditDialog_userFragment} from '../editor/CueExtractionButton/CreditDialog.graphql'
import {handleError} from '../services/error-handler.service'
import LoginDialog from './LoginDialog'
import ForgotPasswordDialog from './ForgotPasswordDialog'
import PasswordResetDialog from './PasswordResetDialog'
import SignUpDialog from './SignUpDialog'
import VerifyEmailDialog from './VerifyEmailDialog'
import EmailVerifiedDialog from './EmailVerifiedDialog'
import {AuthDialogContext} from './auth-dialog-context'
import {getErrorFromCognitoError} from './errors'

AuthDialogProvider.propTypes = {
	children: PropTypes.node.isRequired,
}

export function AuthDialogProvider({children}) {
	const apolloClient = useApolloClient()
	const params = useQueryParams()
	const [viewId, setViewId] = React.useState(params.authDialog || '')
	const [email, setEmail] = React.useState(params.email || '')
	const [loginMessage, setLoginMessage] = React.useState('')

	const authEventsRef = React.useRef(new EventEmitter())
	const justLoggedInRef = React.useRef(false)

	const handleOpenLoginDialog = React.useCallback(msg => {
		setLoginMessage(msg)
		setViewId('LOGIN')
	}, [])

	const handleOpenSignUpDialog = React.useCallback(() => {
		setLoginMessage('')
		setViewId('SIGNUP')
	}, [])

	const handleOpenForgotPasswordDialog = React.useCallback(() => {
		setLoginMessage('')
		setViewId('FORGOT_PWD')
	}, [])

	const handleOpenPasswordResetDialog = React.useCallback(user => {
		setLoginMessage('')
		setEmail(user.getUsername())
		setViewId('RESET_PWD')
	}, [])

	const handleOpenVerifyEmailDialog = React.useCallback(() => {
		setLoginMessage('')
		setViewId('VERIFY_EMAIL')
	}, [])

	const handleOpenEmailVerifiedDialog = React.useCallback(() => {
		setLoginMessage('')
		setViewId('EMAIL_VERIFIED')
	}, [])

	const handleCloseDialog = React.useCallback((e, reason) => {
		if (['backdropClick', 'escapeKeyDown'].includes(reason)) {
			return
		}
		setLoginMessage('')
		setViewId('')
	}, [])

	const handleLogin = React.useCallback(
		(email, password) => {
			return new Promise((resolve, reject) => {
				const cognitoUser = new CognitoUser({Username: email, Pool: cognitoUserPool})
				cognitoUser.authenticateUser(new AuthenticationDetails({Username: email, Password: password}), {
					onSuccess: function() {
						// TODO: spread fragments here
						apolloClient
							.query({
								fetchPolicy: 'network-only',
								query: gql`
									query getUserAfterLoginQuery {
										self {
											id
											email
											credit
											creditMinutes
											unlimitedUsage
											...CreditDialogUser
										}
									}
									${CreditDialog_userFragment}
								`,
							})
							.then(({data: {self}}) => {
								Sentry.setUser(self)
								justLoggedInRef.current = true
								resolve()
								handleCloseDialog()
							})
							.catch(err => {
								handleError(err)
								return reject(err)
							})
					},
					onFailure: err => {
						const error = getErrorFromCognitoError(err)
						handleError(error)
						reject(error)
					},
				})
			})
		},
		[apolloClient, handleCloseDialog]
	)

	const handleLogout = React.useCallback(() => {
		return new Promise((resolve, reject) => {
			const cognitoUser = cognitoUserPool.getCurrentUser()
			if (cognitoUser) {
				cognitoUser.signOut()
			}
			// totally blast the store and retrigger queries so ui updates to "not logged in" mode
			apolloClient
				.resetStore()
				.then(() => {
					resolve()
					handleCloseDialog()
				})
				.catch(reject)
		})
	}, [apolloClient, handleCloseDialog])

	const handleSignUp = React.useCallback(
		async (email, password) => {
			try {
				const response = await fetch(new URL('/v1/sign-up', ApiURL).href, {
					method: 'POST',
					headers: {'Content-Type': 'application/json'},
					body: JSON.stringify({email, password}),
				})
				const result = await response.json()
				if (response.status >= 400) throw new Error(result.message)
				setEmail(result.user.email)
				handleOpenVerifyEmailDialog()
			} catch (err) {
				handleError(err)
				throw err
			}
		},
		[handleOpenVerifyEmailDialog]
	)

	const handleVerifyEmail = React.useCallback(
		code => {
			return new Promise((resolve, reject) => {
				const cognitoUser = new CognitoUser({Username: email, Pool: cognitoUserPool})
				cognitoUser.confirmRegistration(code, false, function(err) {
					if (err) {
						const error = getErrorFromCognitoError(err)
						handleError(error)
						return reject(error)
					}
					resolve()
					handleOpenEmailVerifiedDialog()
				})
			})
		},
		[email, handleOpenEmailVerifiedDialog]
	)

	const handleSendResetCode = React.useCallback(
		email => {
			return new Promise((resolve, reject) => {
				const cognitoUser = new CognitoUser({Username: email, Pool: cognitoUserPool})
				cognitoUser.forgotPassword({
					onSuccess: function() {
						resolve()
						handleOpenPasswordResetDialog(cognitoUser)
					},
					onFailure: function(err) {
						const error = getErrorFromCognitoError(err)
						handleError(error)
						reject(error)
					},
				})
			})
		},
		[handleOpenPasswordResetDialog]
	)

	const handleResendCode = React.useCallback(() => {
		// only reason this might happen is if someone navigated directly to the verify email dialog with ?authDialog=VERIFY_EMAIL
		if (!email) return Promise.reject(new Error('No email found. Please sign up first.'))
		return new Promise((resolve, reject) => {
			const cognitoUser = new CognitoUser({Username: email, Pool: cognitoUserPool})
			cognitoUser.resendConfirmationCode(function(err) {
				if (err) {
					const error = getErrorFromCognitoError(err)
					handleError(error)
					return reject(error)
				}
				resolve()
			})
		})
	}, [email])

	const handleResetPassword = React.useCallback(
		(code, newPassword) => {
			return new Promise((resolve, reject) => {
				const cognitoUser = new CognitoUser({Username: email, Pool: cognitoUserPool})
				cognitoUser.confirmPassword(code, newPassword, {
					onSuccess() {
						resolve()
						handleOpenLoginDialog()
					},
					onFailure(err) {
						const error = getErrorFromCognitoError(err)
						reject(error)
						handleError(error)
					},
				})
			})
		},
		[email, handleOpenLoginDialog]
	)

	const handleExited = React.useCallback(() => {
		// if the user just logged in and the dialog is now exiting, the extraction work flow
		//   relies on this event being fired after the apollo cache has the new user data
		authEventsRef.current.emit('exited', justLoggedInRef.current)
		justLoggedInRef.current = false
	}, [])

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
				maxWidth="xs"
				fullWidth
				open={Boolean(viewId)}
				onClose={handleCloseDialog}
				TransitionProps={{
					onExited: handleExited,
				}}
				aria-labelledby="auth-dialog">
				<AuthView viewId={viewId} loginMessage={loginMessage} />
			</Dialog>
		</AuthDialogContext.Provider>
	)
}

function AuthView({viewId, loginMessage}) {
	if (viewId === 'LOGIN') return <LoginDialog errorMessage={loginMessage} />
	if (viewId === 'FORGOT_PWD') return <ForgotPasswordDialog />
	if (viewId === 'RESET_PWD') return <PasswordResetDialog />
	if (viewId === 'SIGNUP') return <SignUpDialog />
	if (viewId === 'VERIFY_EMAIL') return <VerifyEmailDialog />
	if (viewId === 'EMAIL_VERIFIED') return <EmailVerifiedDialog />
	return null
}

function useQueryParams() {
	const queryString = window.location.search
	return React.useMemo(() => {
		if (!queryString) return {}
		return qs.parse(queryString.slice(1))
	}, [queryString])
}
