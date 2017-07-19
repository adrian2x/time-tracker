import React, {Component} from 'react'
import moment from 'moment'
import {observer} from 'mobx-react'
import store, {displayTimespan} from '../Store'

import History from './History'

@observer
export default class Track extends Component {
	constructor(props) {
		super(props)
		this.state = {
			date: '',
			hours: 0,
			minutes: 0,
			description: ''
		}
	}

	render() {
		const {state, props} = this
		return <div className="container tracker-ct">
			<div className="form-group">
    			<label htmlFor="description">Description</label>
				<input name="description" type="text" className="form-control" 
					placeholder="What are you working on?"
					onChange={this.updateDescription} required autoFocus/>
			</div>
			
			<div className="row form-group">
				<div className="col-xs-4 col-md-3">
					<label htmlFor="date">Date</label>
					<input name="date" type="text" className="form-control" 
						ref={node => this._datepicker = node} placeholder="Date" />
				</div>
				<div className="col-xs-4 col-md-3">
					<label htmlFor="hours">Hours</label>
					<input name="hours" type="number" step=".01" className="form-control" 
						onChange={this.updateHours} required/>
				</div>
				<div className="col-xs-4 col-md-3">
					<label htmlFor="minutes">Minutes</label>
					<input name="minutes" type="number" step=".01" className="form-control"
						onChange={this.updateMinutes} required/>
				</div>
				<div className="col-xs-12 col-md-3">
					<label htmlFor="">&nbsp;</label>
					<button className="btn btn-lg btn-primary btn-block" 
						onClick={this.submit}>Save</button>
				</div>
			</div>

			<History {...props} mode="Today"></History>
		</div>
	}

	submit = (event) => {
		store.newEntry(this.state)
			.catch(err => swal('Error', err.response.text, 'error'))
	}

	updateDescription = (event) => {
		this.setState({description: event.target.value})
	}

	updateDate = (event) => {
		this.setState({date: event.target.value})
	}

	updateHours = (event) => {
		this.setState({hours: event.target.value})
	}

	updateMinutes = (event) => {
		this.setState({minutes: event.target.value})
	}
	
	componentDidMount() {
		$(this._datepicker).datepicker({endDate: new Date()})
			.on('changeDate', event => {
				this.setState({date: event.date})
			})
	}
}


export class Modal extends Component {
	constructor(props) {
		super(props)
		this.state = props.entry
		this.state.date = props.entry.createdAt
	}

	render() {
		let entry = this.state
		return <div className="modal fade" id={entry.slug} tabIndex="-1" role="dialog">
			<div className="modal-dialog" role="document">
				<div className="modal-content">
					<div className="modal-header">
						<button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
						<h4 className="modal-title">Edit entry</h4>
					</div>
					<div className="modal-body">
						<div className="form-group">
							<input name="desc_updated" type="text" className="form-control" 
								defaultValue={entry.description} placeholder="Description"
								onChange={this.updateDescription} required autoFocus/>
						</div>
						<div className="row">
							<div className="col-xs-4">
								<input name="date_updated" type="text" className="form-control" 
									ref={node => this._datepicker = node} placeholder="Date" />
							</div>
							<div className="col-xs-4">
								<input name="hours_updated" type="number" step=".01" className="form-control" 
									defaultValue={entry.hours} placeholder="Hours"
									onChange={this.updateHours} required/>
							</div>
							<div className="col-xs-4">
								<input name="min_updated" type="number" step=".01" className="form-control" 
									defaultValue={entry.minutes} placeholder="Minutes" 
									onChange={this.updateMinutes} required/>
							</div>
						</div>
					</div>
					<div className="modal-footer">
						<span className="pull-left">
							<button type="button" className="btn btn-danger" data-dismiss="modal"
								onClick={this.deleteEntry}>
								<span className="glyphicon glyphicon-trash" aria-hidden="true"/> Delete
							</button>
						</span>
						<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
						<button type="button" className="btn btn-primary" data-dismiss="modal"
							onClick={this.save}>Save Changes</button>
					</div>
				</div>
			</div>
		</div>
	}

	componentDidMount() {
		// Init datepicker
		$(this._datepicker).datepicker({endDate: new Date()})
		.datepicker('update', this.state.date)
			.on('changeDate', event => {
				this.setState({date: event.date})
			})
	}

	save = () => {
		let entry = this.props.entry
		let {description, date, hours, minutes} = this.state
		store.update(entry, {description, date, hours, minutes})
			.catch(err => swal('Error', err.response.text, 'error'))
	}

	deleteEntry = () => {
		let entry = this.props.entry
		swal({
			title: 'Are you sure?',
			text: 'This action cannot be undone.',
			type: 'warning',
			showCancelButton: true,
			confirmButtonText: 'Sure',
			closeOnConfirm: true
		},
		(confirmed) => {
			if (confirmed) {
				store.deleteEntry(entry)
					.catch(err => swal('Error', err.response.text, 'error'))
			}
		})
	}

	updateDescription = (event) => {
		this.setState({description: event.target.value})
	}

	updateHours = (event) => {
		this.setState({hours: event.target.value})
	}

	updateMinutes = (event) => {
		this.setState({minutes: event.target.value})
	}
}
