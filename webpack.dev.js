const path = require('path');
const { DefinePlugin } = require('webpack');
const envConfig = require('./env-config')('.env.dev');

module.exports = {
	entry: {
		main: ['./src/polyfills', './src/index.js'],
	},
	mode: 'development',
	// no `output` necessary, devServer builds and serves files in memory. files are named according to `entry` key
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
		// where to get static files (index.html)
		contentBase: path.join(__dirname, 'public'),
		port: process.env.PORT,
		// where to serve bundles from (main.js will be available at http://localhost:<port>/<publicPath>)
		publicPath: '/',
		hotOnly: true,
	},
};
