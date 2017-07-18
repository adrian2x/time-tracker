module.exports = async function home(ctx, next) {
	// Render page
	await ctx.render('index.html', {
		view: {
			user: ctx.isAuthenticated() ? ctx.state.user : null
		}
	})

	next()
}
