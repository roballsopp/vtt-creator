/* eslint no-undef: 0 */
// Values found here such as API_URL are added by webpack (see DefinePlugin entries)
export const ApiURL = API_URL
export const SpeechToTextJobTimeout = SPEECH_TO_TEXT_JOB_TIMEOUT || 20000
export const SentryDSN = SENTRY_DSN
export const CognitoClientId = COGNITO_CLIENT_ID
export const CognitoUserPoolId = COGNITO_USER_POOL_ID
export const CognitoDomain = COGNITO_DOMAIN
export const DebugMode = Boolean(DEBUG)
export const GAProduct = GA_PRODUCT
export const PaypalClientId = PAYPAL_CLIENT_ID

export const TranscriptionCost = 0.15 // $0.15 per minute
