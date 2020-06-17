const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
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
			STRIPE_KEY: JSON.stringify(process.env.STRIPE_KEY),
			// only stringify strings, SPEECH_TO_TEXT_JOB_TIMEOUT should be a number, see note here: https://webpack.js.org/plugins/define-plugin/#usage
			SPEECH_TO_TEXT_JOB_TIMEOUT: process.env.SPEECH_TO_TEXT_JOB_TIMEOUT,
			SENTRY_DSN: JSON.stringify(process.env.SENTRY_DSN),
			DEBUG: process.env.DEBUG,
			GA_PRODUCT: JSON.stringify(process.env.GA_PRODUCT),
		}),
		new HtmlWebpackPlugin({
			hash: true,
			template: './src/index.html',
			filename: path.join(__dirname, 'public', 'index.html'),
			chunks: ['main'],
		}),
	],
	optimization: {
		minimizer: [new UglifyJsPlugin({ sourceMap: true })],
	},
};
