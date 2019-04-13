const path = require('path');
const HtmlWebPackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: './src/index.js',
	mode: 'development',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
		publicPath: '/dist/'
	},
	module: {
		rules: [
			{
				test: /\.(js)$/,
				exclude: /(node_modules)/,
				loader: "babel-loader",
			}
		]
	},
	// plugins: [
	// 	new HtmlWebPackPlugin({
	// 		template: './src/index.html',
	// 		filename: './index.html',
	// 		chunks: ['index'],
	// 	})
	// ],
	devServer: {
		contentBase: path.join(__dirname, "public/"),
		port: 3000,
		publicPath: "http://localhost:3000/dist/",
		hotOnly: true
	},
};