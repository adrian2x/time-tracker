const MongoClient = require('mongodb').MongoClient
const client = MongoClient.connect(process.env.MONGODB_URI)

module.exports = async function home(ctx, next) {
	// Render page
	await ctx.render('index.html', {
		view: {
			user: ctx.isAuthenticated() ? ctx.state.user : null
		}
	})

	next()
}

module.exports.stubAdmin = async function stubAdmin(ctx, next) {
	let db = await client
	let {username, password} = ctx.request.body
	if (username == 'password' && password == 'password') {
		ctx.session = ctx.session || {tmp_user: {}}
		ctx.session.tmp_user = {
			_id: 'admin12345678',
			name: 'Admin',
			first_name: 'Admin',
			picture: {
				data: {url: 'https://upload.wikimedia.org/wikipedia/commons/0/04/Fxemoji_u263A.svg'}
			},
			timezone: -5,
			entries: [],
			role: 'admin'
		}

		// Insert it in the db (fails if already inserted)
		db.collection('users').insertOne(ctx.session.tmp_user)
	}

	return ctx.redirect('/#/today')
}