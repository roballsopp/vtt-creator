const path = require('path');
const process = require('process');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const chromium = require('chromium');

process.env.CHROME_BIN = chromium.path;
const STATIC_FILES_DIR = path.resolve(__dirname, 'public');

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
					{
						test: /\.(png|svg|jpg|gif)$/,
						loader: 'file-loader',
					},
				],
			},
			plugins: [
				new DefinePlugin({
					API_URL: JSON.stringify(process.env.API_URL),
					STRIPE_KEY: JSON.stringify(process.env.STRIPE_KEY),
					// only stringify strings, SPEECH_TO_TEXT_JOB_TIMEOUT should be a number, see note here: https://webpack.js.org/plugins/define-plugin/#usage
					SPEECH_TO_TEXT_JOB_TIMEOUT: process.env.SPEECH_TO_TEXT_JOB_TIMEOUT,
					SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
					DEBUG: process.env.DEBUG,
				}),
				new HtmlWebpackPlugin({
					hash: true,
					template: './src/index.html',
					filename: path.resolve(STATIC_FILES_DIR, 'index.html'),
					chunks: ['main'],
				}),
			],
		},
		reporters: ['mocha'],
		mochaReporter: {
			showDiff: true,
		},
		port: 9876, // karma web server port
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: ['ChromeHeadlessNoSandbox'],
		customLaunchers: {
			ChromeHeadlessNoSandbox: {
				base: 'ChromeHeadless',
				flags: ['--no-sandbox'],
			},
		},
		plugins: ['karma-chrome-launcher', 'karma-webpack', 'karma-mocha', 'karma-mocha-reporter', 'karma-chai'],
		concurrency: Infinity,
	});
};
