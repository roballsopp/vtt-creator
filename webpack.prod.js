const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { DefinePlugin } = require('webpack');
const envConfig = require('./env-config')('.env');

module.exports = {
	entry: {
		main: ['./src/full-story', './src/polyfills', './src/index.js'],
	},
	mode: 'production',
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
	plugins: [new DefinePlugin(envConfig)],
	optimization: {
		minimizer: [new UglifyJsPlugin()],
	},
};
