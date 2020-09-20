const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		main: ['./src/full-story', './src/google-analytics', './src/polyfills', './src/doorbell', './src/index.js'],
	},
	mode: 'production',
	// this setting and UglifyJsPlugin({ sourceMap: true }) necessary to output source maps
	devtool: 'source-map',
	output: {
		// the filename will just be the corresponding key from the entry object above (entry.main becomes docs/main.js)
		path: path.resolve(__dirname, 'public'),
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
			filename: path.join(__dirname, 'public', 'index.html'),
			chunks: ['main'],
		}),
	],
	optimization: {
		minimizer: [new TerserPlugin({ include: /\.(js)$/, sourceMap: true })],
	},
};
