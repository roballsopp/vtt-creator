import {ExtendableError} from '../errors'

export class NotAuthorizedError extends ExtendableError {
	constructor(m = 'Invalid username or password') {
		super(m)
		this.name = 'NotAuthorizedError'
	}
}

export class UserNotConfirmedError extends ExtendableError {
	constructor(m = 'User not confirmed') {
		super(m)
		this.name = 'UserNotConfirmedError'
	}
}

export class UsernameExistsError extends ExtendableError {
	constructor(m = 'Username already in use') {
		super(m)
		this.name = 'UsernameExistsError'
	}
}

export class InvalidParameterError extends ExtendableError {
	constructor(m = 'Not a valid email') {
		super(m)
		this.name = 'InvalidParameterError'
	}
}

export class CodeMismatchError extends ExtendableError {
	constructor(m = 'Invalid verification code') {
		super(m)
		this.name = 'CodeMismatchError'
	}
}

export class InvalidPasswordError extends ExtendableError {
	constructor(m = 'Invalid password') {
		super(m)
		this.name = 'InvalidPasswordError'
	}
}

export function getErrorFromCognitoError(cognitoErr) {
	switch (cognitoErr.code) {
		case 'NotAuthorizedException':
			return new NotAuthorizedError(cognitoErr.message)
		case 'UserNotConfirmedException':
			return new UserNotConfirmedError(cognitoErr.message)
		case 'UsernameExistsException':
			return new UsernameExistsError(cognitoErr.message)
		case 'InvalidParameterException':
			return new InvalidParameterError(cognitoErr.message)
		case 'CodeMismatchException':
			return new CodeMismatchError(cognitoErr.message)
		case 'InvalidPasswordException':
			return new InvalidPasswordError(cognitoErr.message)
		default:
			// looks like cognito errors can be an Error or non-Error object
			return cognitoErr instanceof Error ? cognitoErr : new Error(`${cognitoErr.code} - ${cognitoErr.message}`)
	}
}
