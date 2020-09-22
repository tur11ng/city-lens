import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import { Dashboard } from './admin/Dashboard'
import { Visualization } from './admin/Visualization'
import { Management } from './admin/Management'
import Auth from '../../shared/Auth'

function Admin () {
  const { path, url } = useRouteMatch()

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to={`${url}`}>CityLens</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to={`${url}`}>Dashboard</Nav.Link>
            <Nav.Link as={Link}
                      to={`${url}/visualization`}>Visualization</Nav.Link>
            <Nav.Link as={Link} to={`${url}/management`}>Management</Nav.Link>
          </Nav>
          <Nav className="ml-auto">
            <Navbar.Text>Welcome {Auth.getName()}!</Navbar.Text>
            <Nav.Item>
              <Nav.Link as={Link} to="/logout">Log out</Nav.Link>
            </Nav.Item>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Switch>
        <Route
          exact path={`${path}/visualization`}
        >
          <Visualization/>
        </Route>
        <Route
          exact path={`${path}/management`}
        >
          <Management/>
        </Route>
        <Route
          exact path={path}
        >
          <Dashboard/>
        </Route>
      </Switch>
    </div>)
}

export default Admin
