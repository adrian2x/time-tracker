const sanitizer = require('sanitizer')

module.exports = 
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
