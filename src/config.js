/* eslint no-undef: 0 */
// Values found here such as API_URL are added by webpack (see DefinePlugin entries)
export const ApiURL = API_URL;
export const apiDisabled = !API_URL;
export const donationDisabled = !(PAYPAL_CLIENT_ID && API_URL);
export const SpeechToTextJobTimeout = SPEECH_TO_TEXT_JOB_TIMEOUT || 20000;
export const SentryDSN = SENTRY_DSN;
export const DebugMode = Boolean(DEBUG);
export const GAProduct = GA_PRODUCT;
export const PayPalClientID = PAYPAL_CLIENT_ID;
