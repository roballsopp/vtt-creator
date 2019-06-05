const path = require('path');
const { DefinePlugin } = require('webpack');
const envConfig = require('./env-config');

module.exports = {
	entry: {
		main: './src/index.js',
	},
	mode: 'development',
	output: {
		// [name] will just be replaced with the corresponding key from the entry object above ([name].js becomes main.js)
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/',
	},
	// map webpack's output back to source files when debugging in chrome https://webpack.js.org/guides/development#using-source-maps
	devtool: 'inline-source-map',
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
	devServer: {
		contentBase: path.join(__dirname, 'public/'),
		port: process.env.PORT,
		publicPath: 'http://localhost:3000/dist/',
		hotOnly: true,
	},
};
