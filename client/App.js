import React, {Component} from 'react'
import Header from './components/Header'
import Main from './components/Main'
import './app.css'

export default function App(props) {
	return <div className="app-wrapper">
		<Header {...props}></Header>
		<Main {...props}></Main>
	</div>
}
