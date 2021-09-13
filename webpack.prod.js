const {config} = require('./webpack.common')

module.exports = {
	...config,
	entry: {
		main: ['./src/full-story', './src/google-analytics', './src/polyfills', './src/doorbell', './src/index.js'],
	},
	mode: 'production',
	devtool: 'source-map',
}
