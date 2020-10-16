/* eslint no-undef: 0 */
// Values found here such as API_URL are added by webpack (see DefinePlugin entries)
import { CognitoUserPool } from 'amazon-cognito-identity-js';

export const ApiURL = API_URL;
export const apiDisabled = !API_URL;
export const SpeechToTextJobTimeout = SPEECH_TO_TEXT_JOB_TIMEOUT || 20000;
export const SentryDSN = SENTRY_DSN;
export const CognitoClientId = COGNITO_CLIENT_ID;
export const CognitoUserPoolId = COGNITO_USER_POOL_ID;
export const CognitoDomain = COGNITO_DOMAIN;
export const DebugMode = Boolean(DEBUG);
export const GAProduct = GA_PRODUCT;

const LoginReturnUrl = encodeURIComponent(`${window.location.origin}/login-redirect`);
export const LoginUrl = `${CognitoDomain}/login?client_id=${CognitoClientId}&redirect_uri=${LoginReturnUrl}&response_type=token`;
export const SignupUrl = `${CognitoDomain}/signup?client_id=${CognitoClientId}&redirect_uri=${LoginReturnUrl}&response_type=token`;

const LogoutReturnUrl = encodeURIComponent(`${window.location.origin}/logout-redirect`);
export const LogoutUrl = `${CognitoDomain}/logout?client_id=${CognitoClientId}&logout_uri=${LogoutReturnUrl}`;

export const TranscriptionCost = 0.15; // $0.15 per minute

export const cognitoUserPool = new CognitoUserPool({
	UserPoolId: CognitoUserPoolId, // Your user pool id here
	ClientId: CognitoClientId,
	// we could force local storage here, but aws uses localStorage by default already and
	//   also does some nice checking and falls back to in memory storage if localStorage isn't available
	//   https://github.com/aws-amplify/amplify-js/blob/master/packages/amazon-cognito-identity-js/src/StorageHelper.js#L70
	// Storage: localStorage,
});
