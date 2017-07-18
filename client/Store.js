import moment from 'moment'
import {observable, computed} from 'mobx'
import request from './http'

class Store {
	// @observable isTracking = false

	// @observable trackingStarted = null
	// @observable trackingEnded = null
	// @observable elapsed = null

	@observable entries = []

	@computed get totalTime() {
		return entriesTotal(this.entries)
	}

	@computed get totalToday() {
		let today = this.entries.filter(entry => isToday(entry.createdAt))
		return entriesTotal(today)
	}

	loadEntries = () => {
		let current = this.entries
		return request.get('/entries')
			.then(res => {
				let {ok, entries} = res.body
				if (ok) {
					current.replace(entries)
				}
			})
			.catch(err => swal('Error', 'Your session is expired.', 'error'))
	}

	newEntry = ({description, date, hours, minutes}) => {
		let list = this.entries
		return request.put('/entries')
			.send({description, date, hours, minutes})
			.then(res => {
				let {ok, entry} = res.body
				if (ok) {
					list.unshift(entry)
				}
			})
			.catch(err => swal('Error', err.response.text, 'error'))
	}

	update = ({slug}, newEntry) => {
		return request.post(`/entries/${slug}`).send(newEntry)
			.then(res => {
				let {ok, entry} = res.body
				if (ok) {
					let index = this.entries.findIndex(item => item.slug == entry.slug)
					this.entries.splice(index, 1, entry)
					return this.entries
				}
			})
			.catch(err => {
				swal('Error', err.response.text, 'error')
				throw err
			})
	}

	deleteEntry = (entry) => {
		return request.delete(`/entries/${entry.slug}`)
			.then(res => {
				let {ok, entries} = res.body
				if (ok) {
					this.entries.replace(entries)
				}
			})
			.catch(err => swal('Error', err.response.text, 'error'))
	}

	// reset = () => {
	// 	clearInterval(this._tracker)
	// 	this.isTracking = false
	// 	this.trackingEnded = this.trackingStarted = null
	// }

	// track = () => {
	// 	if (this.isTracking) {
	// 		return this.reset()
	// 	}

	// 	this.isTracking = true
	// 	let started = moment()
	// 	this.elapsed = null
	// 	this._tracker = setInterval(() => {
	// 		this.elapsed = moment.duration(moment().diff(started))
	// 	}, 100)
	// }
}

export default new Store()

export function isToday(date) {
	return moment(date).isSame(new Date(), 'day')
}

export function entriesTotal(entries) {
	return entries.reduce((total, entry) => {
		let {hours, minutes} = entry
		if (minutes) hours += minutes / 60
		return total + hours
	}, 0)
}

export function displayTimespan(entry) {
	let hours = entriesTotal([entry])
	if (hours < 1) {
		let minutes = parseInt(hours * 60)
		return `${minutes}min`
	}
	return `${hours.toFixed(2)}h`
}
