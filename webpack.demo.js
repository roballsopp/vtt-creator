const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { DefinePlugin } = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		main: ['./src/full-story', './src/polyfills', './src/doorbell', './src/index.js'],
	},
	mode: 'production',
	output: {
		// the filename will just be the corresponding key from the entry object above (entry.main becomes docs/main.js)
		path: path.resolve(__dirname, 'docs'),
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
		}),
		new HtmlWebpackPlugin({
			hash: true,
			template: './src/index.html',
			filename: path.join(__dirname, 'docs', 'index.html'),
			chunks: ['main'],
		}),
	],
	optimization: {
		minimizer: [new UglifyJsPlugin()],
	},
};
