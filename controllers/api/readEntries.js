const fromUser = require('../lib/fromUser')
const orderBy = require('lodash/orderBy')

const MongoClient = require('mongodb').MongoClient
const client = MongoClient.connect(process.env.MONGODB_URI)

module.exports = 
async function read(ctx, next) {
	let user = ctx.state.user
	const db = await client
	const Users = db.collection('users')
	
	try {
		user = await Users.findOne({_id: user._id})
		if (user) {
			ctx.body = {
				ok: true, 
				entries: fromUser(user.entries, user)
			}

			if (user.role == 'admin') {
				// Read entries from other users.
				let otherUsers = await Users.find({_id: {$ne: user._id}}).toArray()
				let entries = ctx.body.entries
				for (let other of otherUsers) {
					entries = entries.concat(fromUser(other.entries, other, true))
				}

				// Order all entries by creation time
				ctx.body.entries = orderBy(entries, ['createdAt'], ['desc'])
			}
			return ctx.body.entries
		}
	}
	catch (err) {
		ctx.status = 500
		ctx.body = err.message
	}
	next()
}
