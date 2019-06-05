const path = require('path');
const { DefinePlugin } = require('webpack');
const envConfig = require('./env-config');

module.exports = config => {
	config.set({
		frameworks: ['mocha', 'chai'],
		files: ['./test/webpack-test-entry.js'],
		preprocessors: {
			'./test/webpack-test-entry.js': ['webpack'],
		},
		webpack: {
			mode: 'development',
			output: {
				filename: 'test.js',
				path: path.resolve(__dirname, 'dist'),
				publicPath: '/dist/',
			},
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
				// see webpack.dev.js for notes on this
				new DefinePlugin(envConfig),
			],
		},
		reporters: ['progress'],
		port: 9876, // karma web server port
		colors: true,
		logLevel: config.LOG_INFO,
		browsers: ['ChromeHeadless'],
		autoWatch: true,
		concurrency: Infinity,
	});
};
