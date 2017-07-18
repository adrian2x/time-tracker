import './header.css'
import React, {Component} from 'react'
import { Link } from 'react-router-dom'

export default function Header(props) {
	const user = props.user
	return <nav className="navbar navbar-default" role="navigation">
	  <div className="container">
			<div className="navbar-header">
				<button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#header-navbar" aria-expanded="false">
					<span className="sr-only">Toggle navigation</span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
					<span className="icon-bar"></span>
				</button>
				<Link to="/" className="navbar-brand">
					<i className="glyphicon glyphicon-time"></i>&nbsp;
					Time Tracker
				</Link>
			</div>

			<div id="navbar-group" className="collapse navbar-collapse" id="header-navbar">
				<ul className="nav navbar-nav">
					{!user && 
						<li><Link to="/signup">Sign up</Link></li>
					}
					{user && 
						<li><Link to="/today">Today</Link></li>
					}
					{user && 
						<li><Link to="/history">History</Link></li>
					}
					{user && user.isAdmin && 
						<li><Link to="/admin">Admin</Link></li>
					}
					{user && 
						<li><a href="/bye">Log out</a></li>
					}
				</ul>
				
				{user &&
					<ul className="nav navbar-nav navbar-right">
						<li className="dropdown">
							<a href="#" className="dropdown-toggle user-profile" data-toggle="dropdown" 
									role="button" aria-haspopup="true" aria-expanded="false">
								<img src={user.picture.data.url} alt={user.first_name}/>
								<span className="caret"></span></a>
							<ul className="dropdown-menu">
								<li><Link to="/history">History</Link></li>
								<li role="separator" className="divider"></li>
								<li><a href="/bye">Log out</a></li>
							</ul>
						</li>
					</ul>
				}
			</div>
		</div>
	</nav>
}
