import React from 'react'
import { Nav, Navbar } from 'react-bootstrap'
import { Upload } from './user/Upload'
import { Dashboard } from './user/Dashboard'
import { FAQ } from './user/FAQ'
import { Link, Route, Switch, useRouteMatch } from 'react-router-dom'
import { Visualization } from './user/Visualization'
import Auth from '../../shared/Auth'

function User () {
  const { path, url } = useRouteMatch()

  return (
    <div>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand as={Link} to={`${url}`}>CityLens</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link} to={`${url}`}>Home</Nav.Link>
            <Nav.Link as={Link}
                      to={`${url}/visualization`}>Visualization</Nav.Link>
            <Nav.Link as={Link} to={`${url}/upload`}>Upload</Nav.Link>
            <Nav.Link as={Link} to={`${url}/faq`}>FAQ</Nav.Link>
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
          exact path={`${path}/faq`}
        >
          <FAQ/>
        </Route>
        <Route
          exact path={`${path}/upload`}
        >
          <Upload/>
        </Route>
        <Route
          exact path={`${path}/visualization`}
        >
          <Visualization/>
        </Route>
        <Route
          exact path={path}
        >
          <Dashboard/>
        </Route>
      </Switch>
    </div>)
}

export default User
