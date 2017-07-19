const fromUser = require('../lib/fromUser')
const validateEntry = require('../lib/validateEntry')

const MongoClient = require('mongodb').MongoClient
const client = MongoClient.connect(process.env.MONGODB_URI)

module.exports = 
async function update(ctx, next) {
	const slug = ctx.params.slug
	let body = ctx.request.body
	let {description, date, hours, minutes} = body
	
	const db = await client
	const Users = db.collection('users')

	try {
		let entry = validateEntry(date, description, hours, minutes)
		let result = await Users.findOneAndUpdate(
			{'entries.slug': slug},
			{$set: {
				'entries.$.createdAt': entry.createdAt,
				'entries.$.description': entry.description,
				'entries.$.hours': entry.hours,
				'entries.$.minutes': entry.minutes,
			}},
			{returnOriginal: false}
		)

		let user = result.value
		let [updatedEntry] = fromUser(user.entries.filter(item => item.slug == slug), user)
		return ctx.body = {ok: true, entry: updatedEntry}
	} 
	catch (err) {
		ctx.status = 500
		ctx.body = err.message
	}

	next()
}
