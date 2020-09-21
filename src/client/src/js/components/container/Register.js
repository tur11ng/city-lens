import React, {Component} from "react";
import FormGroup, {Row, Form, Button, FormControl} from 'react-bootstrap';
import validator from 'validator'
import PasswordValidator from 'password-validator';
import Auth from '../../shared/Auth'
import logo from "../../../logo.png";
import {NavLink} from "react-router-dom";

export class Register extends Component {

    constructor(props) {
        super(props)

        this.state = {
            formSubmitted: false,
            formData: {},
            changed: {name: false, email: false, password: false},
            errors: {name: true, email: true, password: true},
            ok: false
        }
    }

    handleInputChange = (e) => {
        const target = e.target;
        const value = target.value;
        const name = target.name;

        let {formData, changed} = this.state;
        formData[name] = value;
        changed[name] = true;

        this.setState({
            formData: formData,
            changed: changed
        });

        this.validateRegisterForm();
    }

    validateRegisterForm = (e) => {
        const {formData, errors} = this.state;

        errors.name = !!(formData.name !== undefined && validator.isEmpty(formData.name));
        errors.email = formData.email !== undefined && !validator.isEmail(formData.email);

        let schema = new PasswordValidator();
        schema
            .is().min(8)
            .has().uppercase()
            .has().digits()
            .has().symbols()

        errors.password = formData.password !== undefined && !schema.validate(formData.password);

        let ok = !(errors.name || errors.email || errors.password);
        console.log(errors);
        this.setState({
            errors: errors,
            ok: ok
        });
    }

    register = async (e) => {
        e.preventDefault();
        const {formData, ok} = this.state;

        this.setState({
            formSubmitted: true
        });
        console.log(ok);
        if (ok && await Auth.register(
            this.state.formData.name,
            this.state.formData.email,
            this.state.formData.password)) {
            if (await Auth.login(
                formData.email,
                formData.password)) {
                if (Auth.isUser()) {
                    this.props.history.push('/user');
                } else if (Auth.isAdmin()) {
                    this.props.history.push('/admin');
                }

            }
        }
    }

    render() {

        const {errors, formSubmitted, changed} = this.state;

        return (
            <div className="Register">
                <Form onSubmit={this.register}>
                    <div className="text-center">
                        <img src={logo} alt="CityLens"/>
                    </div>
                    <h3 className="text-center">Please register</h3>
                    <Form.Group controlId="name">
                        <Form.Control required type="text" name="name" placeholder="Name"
                                      onChange={this.handleInputChange}
                                      isInvalid={(errors.email && changed.email) || formSubmitted}/>
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Control required type="text" name="email" placeholder="Email address"
                                      onChange={this.handleInputChange}
                                      isInvalid={(errors.email && changed.email) || formSubmitted}/>
                        <Form.Control.Feedback type="invalid">Please enter a valid email.</Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Control required type="password" name="password" placeholder="Password"
                                      onChange={this.handleInputChange}
                                      isInvalid={(errors.email && changed.email) || formSubmitted}/>
                        <Form.Control.Feedback type="invalid">Must be min. 8 characters including at least an
                            uppercase letter, a number and a symbol.</Form.Control.Feedback>
                        <small id="passwordHelpBlock" className="form-text text-muted">
                            Your password must be at least 8 characters long, must contain at least an uppercase
                            letter
                            a number and a symbol (e.g #$*&@).
                        </small>
                    </Form.Group>
                    <Form.Group>
                        <Form.Control required type="password" name="passwordRetype" placeholder="Retype password"
                                      onChange={this.handleInputChange}
                                      isInvalid={(errors.email && changed.email) || formSubmitted}/>
                    </Form.Group>
                    <Button type="submit" bsStyle="primary" size="lg" block>Register</Button>
                    <div>
                        Already have an account?<NavLink to="/login"> Log in</NavLink>
                    </div>
                </Form>
            </div>
        )
    }
}
