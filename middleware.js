const path = require('path')
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
	
	app.use(cors()) // Allow CORS

	app.use(bodyParser()) // Process payloads
	
	app.use(templates(__dirname, { map: {html: 'ejs' }})) // Render views
}
