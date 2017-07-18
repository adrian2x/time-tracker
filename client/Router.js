import React from 'react'
import ReactDOM from 'react-dom'
import {HashRouter} from 'react-router-dom'
import App from './App'
import store from './Store'

let props = JSON.parse(decodeURI(window.VIEW))

const mount = Component => ReactDOM.render(
  <HashRouter>
    <Component store={store} {...props}></Component>
  </HashRouter>,
  document.getElementById('app')
)

mount(App)
