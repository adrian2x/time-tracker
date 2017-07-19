const test = require('tape')
const sinon = require('sinon')
const validateEntry = require('../controllers/lib/validateEntry')

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
