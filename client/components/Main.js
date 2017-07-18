import React from 'react'
import Login from './Login'
import Track from './Track'
import History from './History'
import { Switch, Route, Link } from 'react-router-dom'

export default function Main(props) {
  return <Switch>
    <Route exact path='/' component={Home}/>
    <Route exact path='/signup' component={Login}/>
    <Route exact path='/today' render={() => <Track {...props}></Track>}/>
    <Route exact path='/history' render={() => <History mode="Total" {...props}></History>}/>
  </Switch>
}

function Home() {
	return <div className="jumbotron">
      <div className="container">
        <h1>Time tracker web</h1>
        <p>Sign up today to start tracking time spent in tasks.</p>
        <p>
          <Link to="/signup" className="btn btn-primary btn-lg">Sign Up »</Link>
        </p>
      </div>
    </div>
}
