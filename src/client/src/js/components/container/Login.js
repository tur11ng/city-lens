import React, { Component } from 'react'
import { Button, Form } from 'react-bootstrap'
import { NavLink } from 'react-router-dom'
import validator from 'validator'
import Auth from '../../shared/Auth'
import logo from '../../../logo.png'

export class Login extends Component {

  constructor (props) {
    super(props)

    this.state = {
      formData: {},
      formInvalid: false,
      changed: { email: false, password: false },
      errors: { email: true, password: true },
      ok: false,
    }
  }

  handleInputChange = (e) => {
    const target = e.target
    const value = target.value
    const name = target.name

    let { formData, changed } = this.state
    formData[name] = value
    changed[name] = true

    this.setState({
      formData: formData,
      changed: changed,
    })

    this.validateLoginForm()
  }

  validateLoginForm = () => {
    const { formData, errors } = this.state

    errors.email = formData.email !== undefined &&
      !validator.isEmail(formData.email)
    errors.password = !!(formData.password !== undefined &&
      validator.isEmpty(formData.password))

    let ok = !(errors.email || errors.password)

    this.setState({
      errors: errors,
      ok: ok,
    })
  }

  login = async (e) => {
    e.preventDefault()
    const { formData, ok } = this.state
    if (ok && await Auth.login(
      formData.email,
      formData.password)) {
      if (Auth.isUser()) {
        console.log()
        this.props.history.push('/user')
      } else if (Auth.isAdmin()) {
        this.props.history.push('/admin')
      }
    } else {
      this.setState({
        formInvalid: true,
      })
    }

  }

  render () {

    const { formInvalid, changed, errors } = this.state

    return (
      <div className="Login">
        <Form onSubmit={this.login}>
          <div className="text-center">
            <img src={logo} alt="CityLens"/>
          </div>
          <h3 className="text-center"> Please login</h3>
          <Form.Group controlId="email">
            <Form.Control required type="text" name="email"
                          placeholder="Email address"
                          onChange={this.handleInputChange}
                          isInvalid={(errors.email && changed.email) ||
                          formInvalid}/>
            <Form.Control.Feedback type="invalid">Please enter a valid
              email</Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="password">
            <Form.Control required type="password" name="password"
                          placeholder="Password"
                          onChange={this.handleInputChange}
                          isInvalid={(errors.password && changed.password) ||
                          formInvalid}/>
            <Form.Control.Feedback type="invalid">Please enter a valid
              password</Form.Control.Feedback>
          </Form.Group>
          <Button type="submit" bsStyle="primary" block>Log In</Button>
          <div>
            Not a member yet?<NavLink to="/register"> Register now</NavLink>
          </div>
        </Form>
      </div>
    )
  }
}