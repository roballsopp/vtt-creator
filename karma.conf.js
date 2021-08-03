const path = require('path')
const process = require('process')
const {DefinePlugin} = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const chromium = require('chromium')

process.env.CHROME_BIN = chromium.path
const STATIC_FILES_DIR = path.resolve(__dirname, 'public')

module.exports = config => {
	config.set({
		frameworks: ['mocha', 'chai'],
		files: ['./test/webpack-test-entry.js'],
		preprocessors: {
			'./test/webpack-test-entry.js': ['webpack'],
		},
		webpack: {
			mode: 'production',
			devtool: 'eval-source-map',
			// output not necessary, webpack does it all in-memory
			module: {
				rules: [
					{
						loader: 'babel-loader',
						test: /\.(js)$/,
						exclude: /(node_modules)/,
					},
					{
						test: /\.(png|svg|jpg|gif|wav|mp4)$/,
						type: 'asset/resource',
					},
				],
			},
			plugins: [
				new DefinePlugin({
					API_URL: JSON.stringify(process.env.API_URL),
					// only stringify strings, SPEECH_TO_TEXT_JOB_TIMEOUT should be a number, see note here: https://webpack.js.org/plugins/define-plugin/#usage
					SPEECH_TO_TEXT_JOB_TIMEOUT: process.env.SPEECH_TO_TEXT_JOB_TIMEOUT,
					SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
					COGNITO_CLIENT_ID: JSON.stringify(process.env.COGNITO_CLIENT_ID),
					COGNITO_DOMAIN: JSON.stringify(process.env.COGNITO_DOMAIN),
					COGNITO_USER_POOL_ID: JSON.stringify(process.env.COGNITO_USER_POOL_ID),
					DEBUG: process.env.DEBUG,
					GA_PRODUCT: JSON.stringify(process.env.GA_PRODUCT),
					PAYPAL_CLIENT_ID: JSON.stringify(process.env.PAYPAL_CLIENT_ID),
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
	})
}
