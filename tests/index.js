const test = require('tape')
const sinon = require('sinon')
const validateEntry = require('../controllers/lib/validateEntry')
const fromUser = require('../controllers/lib/fromUser')

test('Creating entries', t => {

	t.test('Creating entry with no date', assert => {
		assert.throws(() => validateEntry(null),
			'Please enter a valid date'
		)
		assert.end()
	})

	t.test('Creating entry with no description', assert => {
		assert.throws(() => validateEntry(new Date()), 
			'Please enter a description and time worked'
		)
		assert.end()
	})

	t.test('Creating entry with no hours', assert => {
		assert.throws(() => validateEntry(new Date(), 'Hello!'), 
			'Please enter a description and time worked',
			'Throws error'
		)
		assert.end()
	})

	t.test('Creating valid entry', assert => {
		assert.doesNotThrow(() => validateEntry(new Date(), 'Hello!', 1))
		assert.end()
	})
})

test('Reading entries', t => {
	const mockUser = {_id: Math.random()}

	t.test('No user', assert => {
		assert.throws(() => fromUser(), 
			'Unable to read user entries',
			'Throws error'
		)
		assert.end()
	})

	t.test('No entries', assert => {
		let entries = fromUser(mockUser.entries, mockUser)
		assert.equals(entries.length, 0)
		assert.end()
	})

	t.test('With entries', assert => {
		mockUser.entries = [{slug: 'Entry'}]
		let entries = fromUser(mockUser.entries, mockUser)
		assert.ok(entries[0].user)
		assert.equals(entries.length, mockUser.entries.length)
		assert.equals(entries[0].user._id, mockUser._id)
		assert.end()
	})
})
