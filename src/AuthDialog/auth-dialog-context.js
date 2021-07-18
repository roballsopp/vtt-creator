import React from 'react'

export const AuthDialogContext = React.createContext({
	openLoginDialog: () => {},
	openSignupDialog: () => {},
	openForgotPasswordDialog: () => {},
	openPasswordResetDialog: () => {},
	openVerifyEmailDialog: () => {},
	openEmailVerifiedDialog: () => {},
	login: () => {},
	logout: () => {},
	signup: () => {},
	verifyEmail: () => {},
	sendResetCode: () => {},
	resendCode: () => {},
	resetPassword: () => {},
	closeDialog: () => {},
	authDialogEvents: {},
})

export function useAuthDialog() {
	return React.useContext(AuthDialogContext)
}
