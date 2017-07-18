const path = require('path')
const webpack = require('webpack')

module.exports = {
	entry: [
		'react-hot-loader/patch',
		'webpack-dev-server/client?http://localhost:3001',
		'webpack/hot/only-dev-server',
		'./client/Router.js'
	],
	
	devtool: 'inline-source-map',

	output: {
		path: path.resolve(__dirname, 'dist'),
		filename: 'bundle.js',
		publicPath: '/dist/'
	},

	module: {
		rules: [
			{ test: /\.css$/, use: [ 'style-loader', 'css-loader' ]},
			{ test: /\.js$/, use: 'babel-loader', exclude: /node_modules/ },
			{ test: /\.jsx$/, use: 'babel-loader', exclude: /node_modules/ }
		]
	},

	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		new webpack.NamedModulesPlugin(),
		new webpack.NoEmitOnErrorsPlugin(),
	],

	devServer: {
		host: 'localhost',
		port: 3001,
		hot: true, // Tell the dev-server we're using HMR
		historyApiFallback: true,
		publicPath: '/dist/'
	}
}
