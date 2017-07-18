const Router = require('koa-router')
const home = require('./controllers/home')
const tracking = require('./controllers/tracking')
const auth = require('./auth')

const router = new Router()

module.exports = function (app) {

	let passport = auth(app)
	app.use(passport.initialize())
	app.use(passport.session())

	router.get('/', home)
		  .get('/entries', isLoggedIn, tracking.read)
		  .put('/entries', isLoggedIn, tracking.create)
		  .post('/entries/:slug', isLoggedIn, tracking.update)
		  .delete('/entries/:slug', isLoggedIn, tracking.remove)
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
				ctx.redirect('/')
			})


	app.use(router.routes())
	app.use(router.allowedMethods())
}

function isLoggedIn(ctx, next) {
	if (ctx.isAuthenticated()) return next()
	else ctx.redirect('/#/signup')
}