import React from 'react'
import ReactDOM from 'react-dom'
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from 'react-router-dom'
import { Login } from './components/container/Login'
import { Register } from './components/container/Register'
import Admin from './components/container/Admin'
import User from './components/container/User'
import { ProtectedRoute } from './components/presentational/ProtectedRoute'
import Auth from './shared/Auth'
import './App.css'
import { Logout } from './components/container/Logout'

$.fn.selectpicker.Constructor.BootstrapVersion = '4'

export function App () {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          {Auth.isAuthenticated() ? (Auth.isAdmin() ? <Redirect to="/admin"/> :
            <Redirect to="/user"/>) : <Redirect to="/login"/>}
        </Route>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/logout" component={Logout}/>
        <Route exact path="/register" component={Register}/>
        <ProtectedRoute path="/admin"
                        authCheck={Auth.isAdmin}
                        component={Admin}
        />
        <ProtectedRoute path="/user"
                        authCheck={Auth.isUser}
                        component={User}
        />

        <Route path="*" component={() => 'Oops!'}/>

      </Switch>
    </Router>
  )
}

const container = document.getElementById('container')
container ? ReactDOM.render(<App/>, container) : false