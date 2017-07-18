const path = require('path')
const files = require('koa-static')
const passport = require('koa-passport')
const cors = require('kcors')
const sanitizer = require('sanitizer')
const convert = require('koa-convert')
const bodyParser = require('koa-body')
const templates = require('koa-views')
const session = require('koa-generic-session')

module.exports = function (app) {
	app.keys = ['JamesBondIs007']
	app.use(session(app))

	// Serve static files
	app.use(files(path.join(__dirname, 'public')))

	// Allow CORS
	app.use(cors())

	app.use(bodyParser())
	
	app.use(templates(__dirname, { map: {html: 'ejs' }}))
}
