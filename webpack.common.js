const path = require('path')
const {DefinePlugin} = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

const STATIC_FILES_DIR = path.resolve(__dirname, 'public')

const config = {
	output: {
		filename: '[name].bundle.js',
		chunkFilename: '[name].[chunkhash].bundle.js',
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
				type: 'asset/resource',
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
			COGNITO_USER_POOL_ID: JSON.stringify(process.env.COGNITO_USER_POOL_ID),
			DEBUG: process.env.DEBUG,
			GA_PRODUCT: JSON.stringify(process.env.GA_PRODUCT),
			GA_DEBUG: process.env.GA_DEBUG,
			PAYPAL_CLIENT_ID: JSON.stringify(process.env.PAYPAL_CLIENT_ID),
		}),
		new HtmlWebpackPlugin({
			hash: true,
			template: './src/index.html',
			templateParameters: {
				PAYPAL_CLIENT_ID: process.env.PAYPAL_CLIENT_ID,
			},
			favicon: './assets/vtt-creator-logo.svg',
			filename: path.resolve(STATIC_FILES_DIR, 'index.html'),
			chunks: ['main'],
		}),
	],
}

module.exports = {
	STATIC_FILES_DIR,
	config,
}
