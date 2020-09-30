const path = require('path');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const STATIC_FILES_DIR = path.resolve(__dirname, 'public');

module.exports = {
	// files are named according to `entry` key
	entry: {
		main: ['./src/google-analytics', './src/polyfills', './src/doorbell', './src/index.js'],
	},
	mode: 'development',
	// map webpack's output back to source files when debugging in chrome https://webpack.js.org/configuration/devtool/
	devtool: 'eval-source-map',
	output: {
		path: STATIC_FILES_DIR,
		publicPath: '/',
	},
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
		// webpack essentially does a find and replace on each key listed here. API_URL cannot be accessed
		// in the app via global.API_URL, process.env.API_URL, or any way other than plain 'ol API_URL.
		// If you define something here like 'process.env.API_URL', it will only work if you access it in app
		// by explicitly writing out 'process.env.API_URL'. It won't work if you do const { API_URL } = process.env;
		new DefinePlugin({
			API_URL: JSON.stringify(process.env.API_URL),
			// only stringify strings, SPEECH_TO_TEXT_JOB_TIMEOUT should be a number, see note here: https://webpack.js.org/plugins/define-plugin/#usage
			SPEECH_TO_TEXT_JOB_TIMEOUT: process.env.SPEECH_TO_TEXT_JOB_TIMEOUT,
			SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
			COGNITO_CLIENT_ID: JSON.stringify(process.env.COGNITO_CLIENT_ID),
			COGNITO_DOMAIN: JSON.stringify(process.env.COGNITO_DOMAIN),
			DEBUG: process.env.DEBUG,
			GA_PRODUCT: JSON.stringify(process.env.GA_PRODUCT),
			PAYPAL_CLIENT_ID: JSON.stringify(process.env.PAYPAL_CLIENT_ID),
		}),
		new HtmlWebpackPlugin({
			hash: true,
			template: './src/index.html',
			templateParameters: {
				PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
			},
			filename: path.resolve(STATIC_FILES_DIR, 'index.html'),
			chunks: ['main'],
		}),
	],
	devServer: {
		// where to get static files (index.html)
		contentBase: STATIC_FILES_DIR,
		port: 3000,
		// where to serve bundles from (main.js will be available at http://localhost:<port>/<publicPath>)
		publicPath: '/',
		historyApiFallback: true,
		overlay: true,
	},
};
