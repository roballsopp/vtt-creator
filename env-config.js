module.exports = envFile => {
	require('dotenv').config({ path: envFile });

	return {
		API_URL: JSON.stringify(process.env.API_URL),
		STRIPE_KEY: JSON.stringify(process.env.STRIPE_KEY),
		// only stringify strings, SPEECH_TO_TEXT_JOB_TIMEOUT should be a number, see note here: https://webpack.js.org/plugins/define-plugin/#usage
		SPEECH_TO_TEXT_JOB_TIMEOUT: process.env.SPEECH_TO_TEXT_JOB_TIMEOUT,
		SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
	};
};
