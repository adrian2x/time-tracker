const path = require('path')
const sanitizer = require('sanitizer')
const orderBy = require('lodash/orderBy')
const uuidv4 = require('uuid/v4')

const MongoClient = require('mongodb').MongoClient
const client = MongoClient.connect(process.env.MONGODB_URI)

module.exports = {create, read, update, remove}

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

function validateEntry(date, description, hours, minutes) {
	let entry = {
		description: sanitizer.sanitize(description),
		hours: parseFloat(hours),
		minutes: parseFloat(minutes)
	}

	// Validate date
	if (date) {
		let timestamp = Date.parse(date)
		if (isNaN(timestamp)) {
			throw Error('Please enter a valid date.')
		}
		entry.createdAt = new Date(timestamp)
	}
	else {
		entry.createdAt = new Date()
	}

	// Validate time ranges
	if (!hours && !minutes) {
		throw Error('Please check time ranges.')
	}
	if (0 > hours || hours > 24) {
		throw Error('Please check time ranges.')
	}
	if (0 > minutes || minutes > 60) {
		throw Error('Please check time ranges.')
	}

	// Validate description
	if (!entry.description) {
		throw Error('Please enter a description and time worked.')
	}

	return entry
}

function fromUser(entries, user, disableSort) {
	// Sort entries
	if (disableSort == undefined) {
		entries = orderBy(entries, ['createdAt'], ['desc'])
	}
	// Add user data to the entries to id owner
	let {_id, first_name, timezone, picture} = user
	return entries.map(entry => {
		entry.user = {_id, first_name, timezone, picture}
		return entry
	})
}
