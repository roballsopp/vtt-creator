const path = require('path');
const { DefinePlugin } = require('webpack');
require('dotenv').config();

const getEnvVar = (name, { optional } = { optional: false }) => {
	const envVar = process.env[name];
	if (!optional && !envVar) {
		throw new Error(`Missing env var ${name} . Did you forget to add it to a .env file?`);
	}

	return JSON.stringify(envVar);
};

module.exports = {
	entry: './src/index.js',
	mode: 'development',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/',
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /(node_modules)/,
				loader: 'babel-loader',
			},
		],
	},
	plugins: [
		// webpack essentially does a find and replace on each key listed here. API_URL cannot be accessed
		// in the app via global.API_URL, process.env.API_URL, or any way other than plain 'ol API_URL.
		// If you define something here like 'process.env.API_URL', it will only work if you access it in app
		// by explicitly writing out 'process.env.API_URL'. It won't work if you do const { API_URL } = process.env;
		new DefinePlugin({
			API_URL: getEnvVar('API_URL'),
		}),
	],
	devServer: {
		contentBase: path.join(__dirname, 'public/'),
		port: process.env.PORT,
		publicPath: 'http://localhost:3000/dist/',
		hotOnly: true,
	},
};
