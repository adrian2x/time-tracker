import './login.css'
import React from 'react'

export default function Login() {
	return <div className="container">
      <form className="form-signin">
        <h2 className="form-signin-heading">Please sign in</h2>
        <label htmlFor="inputEmail" className="sr-only">Email address</label>
        <input type="email" id="inputEmail" className="form-control" placeholder="Email address" required="" autoFocus="" />
        <label htmlFor="inputPassword" className="sr-only">Password</label>
        <input type="password" id="inputPassword" className="form-control" placeholder="Password" required="" />

		    <button className="btn btn-lg btn-primary btn-block btn-signin" type="submit">Sign in</button>
		
		    <p className="text-center">Don't have an account yet?</p>
        <a href="/fb" className="btn btn-lg btn-primary btn-block btn-fb">Sign up with Facebook</a>
      </form>
    </div>
}
