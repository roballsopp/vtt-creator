import {CognitoUserPool} from 'amazon-cognito-identity-js'
import {CognitoClientId, CognitoUserPoolId} from './config'

export {AuthenticationDetails, CognitoUser} from 'amazon-cognito-identity-js'

export const cognitoUserPool = new CognitoUserPool({
	UserPoolId: CognitoUserPoolId, // Your user pool id here
	ClientId: CognitoClientId,
	// we could force local storage here, but aws uses localStorage by default already and
	//   also does some nice checking and falls back to in memory storage if localStorage isn't available
	//   https://github.com/aws-amplify/amplify-js/blob/master/packages/amazon-cognito-identity-js/src/StorageHelper.js#L70
	// Storage: localStorage,
})
