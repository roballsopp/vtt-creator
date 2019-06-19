const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { DefinePlugin } = require('webpack');
const envConfig = require('./env-config')('.env');

module.exports = {
	entry: {
		main: ['./src/polyfills', './src/index.js'],
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
		],
	},
	plugins: [
		// webpack essentially does a find and replace on each key listed here. API_URL cannot be accessed
		// in the app via global.API_URL, process.env.API_URL, or any way other than plain 'ol API_URL.
		// If you define something here like 'process.env.API_URL', it will only work if you access it in app
		// by explicitly writing out 'process.env.API_URL'. It won't work if you do const { API_URL } = process.env;
		new DefinePlugin(envConfig),
	],
	optimization: {
		minimizer: [new UglifyJsPlugin()],
	},
};
