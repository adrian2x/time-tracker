const fromUser = require('../lib/fromUser')

const MongoClient = require('mongodb').MongoClient
const client = MongoClient.connect(process.env.MONGODB_URI)

module.exports = 
async function remove(ctx, next) {
	const slug = ctx.params.slug
	try {
		const db = await client
		const Users = db.collection('users')

		let result = await Users.findOneAndUpdate(
			{'entries.slug': slug},
			{$pull: {entries: {slug}}},
			{returnOriginal: false}
		)
		let user = result.value
		return ctx.body = {ok: true, entries: fromUser(user.entries, user)}
	}
	catch (err) {
		ctx.status = 500
		ctx.body = err.message
	}
	next()
}
