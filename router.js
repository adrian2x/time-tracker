const Router = require('koa-router')
const send = require('koa-send')
const home = require('./controllers/home')
const createEntry = require('./controllers/api/createEntry')
const readEntries = require('./controllers/api/readEntries')
const updateEntry = require('./controllers/api/updateEntry')
const deleteEntry = require('./controllers/api/deleteEntry')
const auth = require('./auth')

const router = new Router()

module.exports = function (app) {

	let passport = auth(app)
	app.use(passport.initialize())
	app.use(passport.session())

	router.get('/', home)
		  .post('/', home.stubAdmin)
		  .get('/entries', isLoggedIn, readEntries)
		  .put('/entries', isLoggedIn, createEntry)
		  .post('/entries/:slug', isLoggedIn, updateEntry)
		  .delete('/entries/:slug', isLoggedIn, deleteEntry)
		  .get('/fb', passport.authenticate('facebook', {
				scope: [
					'public_profile',
					'email',
				],
			}))
			.get('/auth/fb', passport.authenticate('facebook', {
				successRedirect : '/#/today',
				failureRedirect : '/'
			}))
			.get('/bye', function(ctx, next) {
				ctx.logout()
				delete ctx.session.tmp_user
				ctx.redirect('/')
			})


	app.use(router.routes())
	app.use(router.allowedMethods())

	// Serve static requests
	app.use(async function (ctx, next) {
		await send(ctx, ctx.path, {root: __dirname})
		next()
	})
}

async function isLoggedIn(ctx, next) {
	if (ctx.isAuthenticated()) {
		return await next()
	}
	else ctx.redirect('/#/signup')
}