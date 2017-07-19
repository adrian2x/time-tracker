import './history.css'
import React, {Component} from 'react'
import {observer} from 'mobx-react'
import moment from 'moment'
import {Modal} from './Track'
import store, {isToday, displayTimespan} from '../Store'


@observer
export default class History extends Component {
	render() {
		let entries = store.entries
		let total = store.totalTime

		const mode = this.props.mode
		if (mode == 'Today') {
			entries = entries.filter(entry => isToday(entry.createdAt))
			total = store.totalToday
		}
		
		return <div className="container row history-ct" data-mode={mode}>
			{total > 0 && <h3 className="totals">
				<span className="label label-primary">{total.toFixed(2)}h</span> {mode}</h3>
			}

			{entries.length < 1 && <p className="empty_state">No items.</p>}

			<ul className="list history_entries">
				{entries.map((entry, i) => 
					<li key={entry.description} className="panel panel-default">
						<div className="row">
							<div className="col-xs-1 user">
								<img src={entry.user.picture.data.url} className="user-avatar" />
							</div>
							<div className="col-xs-8 col-md-10">
								<h4 className="entry_description">
									{entry.description} &nbsp;
									<span className="label label-primary">{displayTimespan(entry)}</span>

									{ canEdit(entry, this.props.user) &&
										<span>
											<button type="button" className="btn btn-default btn-lg btn-edit"
												data-toggle="modal" data-target={`#${entry.slug}`}>
												<i className="glyphicon glyphicon-pencil" aria-hidden="true"></i>
											</button>
											<Modal entry={entry}></Modal>
										</span>
									}
								</h4>
							</div>
							<div className="entry_details col-xs-1 text-right">
								<div className="calendar_date">
									<div className="entry_month">
										{moment(entry.createdAt).format('MMM')}
									</div>
									<div className="entry_date">
										{moment(entry.createdAt).format('D')}
									</div>
								</div>
							</div>
						</div>
					</li>
				)}
			</ul>
		</div>
	}

	componentDidMount() {
		store.loadEntries()
	}
}

function canEdit(entry, user) {
	return entry.user._id == user._id && isToday(entry.createdAt)
}