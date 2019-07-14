/* eslint no-undef: 0 */
// Values found here such as API_URL are added by webpack (see DefinePlugin entries)
export const ApiURL = API_URL;
export const apiDisabled = !API_URL;
export const StripeKey = STRIPE_KEY;
export const donationDisabled = !(STRIPE_KEY && API_URL);
export const SpeechToTextJobTimeout = SPEECH_TO_TEXT_JOB_TIMEOUT || 20000;
export const SentryDSN = SENTRY_DSN;
export const DebugMode = DEBUG;
