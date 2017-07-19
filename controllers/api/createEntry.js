const uuidv4 = require('uuid/v4')
const validateEntry = require('../lib/validateEntry')
const fromUser = require('../lib/fromUser')

const MongoClient = require('mongodb').MongoClient
const client = MongoClient.connect(process.env.MONGODB_URI)

module.exports = 
async function create(ctx, next) {
	let body = ctx.request.body
	let {description, date, hours, minutes} = body
	
	let user = ctx.state.user
	const db = await client
	const Users = db.collection('users')

	try {
		let entry = validateEntry(date, description, hours, minutes)

		// Create new entry
		entry.slug = uuidv4()
		let newEntry = await Users.updateOne({_id: user._id}, {
			$push: {entries: entry}
		})
		let [createdEntry] = fromUser([entry], user)
		return ctx.body = {ok: true, entry: createdEntry}
	} 
	catch (err) {
		ctx.status = 500
		ctx.body = err.message
	}

	next()
}
