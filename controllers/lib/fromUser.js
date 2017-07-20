const orderBy = require('lodash/orderBy')

module.exports = 
function fromUser(entries, user, disableSort) {
	if (!user) throw Error('Unable to read user entries')

	if (Array.isArray(entries)) {
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
	return []
}
