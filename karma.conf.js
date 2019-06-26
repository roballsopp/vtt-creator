const { DefinePlugin } = require('webpack');
const envConfig = require('./env-config')('.env.test');

module.exports = config => {
	config.set({
		frameworks: ['mocha', 'chai'],
		files: ['./test/webpack-test-entry.js'],
		preprocessors: {
			'./test/webpack-test-entry.js': ['webpack'],
		},
		webpack: {
			mode: 'production',
			// output not necessary, webpack does it all in-memory
			module: {
				rules: [
					{
						loader: 'babel-loader',
						test: /\.(js)$/,
						exclude: /(node_modules)/,
					},
				],
			},
			plugins: [new DefinePlugin(envConfig)],
		},
		reporters: ['mocha'],
		mochaReporter: {
			showDiff: true,
		},
		port: 9876, // karma web server port
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: ['ChromeHeadless'],
		concurrency: Infinity,
	});
};
