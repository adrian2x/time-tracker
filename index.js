const Koa = require('koa')
const app = new Koa()
const http = require('http')

require('dotenv').load()

require('./middleware')(app)
require('./router')(app)

// Starts the server
app.listen(3000)

const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const config = require('./webpack.config.js')

if (process.env.NODE_ENV == 'development') {
	// WEBPACK DEV SERVER
	new WebpackDevServer(webpack(config), {
		hot: true, // Tell the dev-server we're using HMR
		historyApiFallback: true,
		publicPath: '/dist/',
		proxy: {
			'*': 'http://localhost:3000'
		}
	}).listen(3001, 'localhost', function (err, result) {
		if (err) {
			console.log(err);
		}
		console.log('Webpack Dev Server (Hot-Reload) listening on port 3001');
	})
}
