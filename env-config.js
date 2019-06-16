const getEnvVar = (name, { optional } = { optional: false }) => {
	const envVar = process.env[name];
	if (!optional && !envVar) {
		throw new Error(`Missing env var ${name} . Did you forget to add it to a .env file?`);
	}

	return JSON.stringify(envVar);
};

module.exports = envFile => {
	require('dotenv').config({ path: envFile });

	return {
		API_URL: getEnvVar('API_URL', { optional: true }),
		STRIPE_KEY: getEnvVar('STRIPE_KEY', { optional: true }),
	};
};
