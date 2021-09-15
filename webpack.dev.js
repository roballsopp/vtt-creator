const {config, STATIC_FILES_DIR} = require('./webpack.common')

module.exports = {
	...config,
	entry: {
		main: ['./src/google-analytics', './src/polyfills', './src/doorbell', './src/index.js'],
	},
	mode: 'development',
	// map webpack's output back to source files when debugging in chrome https://webpack.js.org/configuration/devtool/
	devtool: 'eval-source-map',
	devServer: {
		port: 3000,
		historyApiFallback: true,
		static: {
			// where to get static files (index.html)
			directory: STATIC_FILES_DIR,
		},
		// gzips all assets before serve
		//  netlify uses brotli to automatically do this so we don't need to generate compress files for prod
		compress: true,
		client: {
			overlay: true,
			progress: true,
		},
	},
}
