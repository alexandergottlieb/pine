import React, { Component } from "react"
import Input from "./Input"
import Button from "./Button"
import Messages from "./Messages"
import "../css/Login.css"

export default class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            email: "",
            password: "",
            register: false
        }
    }

    changeEmail(value) {
        this.setState({
            email: value
        })
    }

    changePassword(value) {
        this.setState({
            password: value
        })
    }

    login() {
        const { actions } = this.props
        actions.login(this.state.email, this.state.password)
    }

    forgotPassword() {
        const { actions } = this.props
        actions.forgotPassword(this.state.email)
    }

    register() {
        const { actions } = this.props

    }

    toggleRegister() {
        this.setState({
            register: !this.state.register
        })
    }

    render() {
        const { current } = this.props
        const { register } = this.state
        return (
            <div className="login">
                <div className="login__form">
                    <h1>{register ? "Register" : "Sign In"}</h1>
                    <small>or <a onClick={this.toggleRegister.bind(this)}>{register ? "Sign In" : "Register"}</a></small>
                    <Input type="email" label="Email" onChange={val => this.changeEmail(val)} />
                    <Input type="password" label="Password" />
                    {register
                        ? <Input type="text" label="Name" />
                        : null
                    }
                    <div className="login__buttons">
                        {register
                            ? <Button type="primary" onClick={this.register.bind(this)}>Register</Button>
                            : <div>
                                <small>
                                    <a onClick={this.forgotPassword.bind(this)}>Forgot password?</a>
                                </small>
                                <Button type="primary" onClick={this.login.bind(this)}>Sign In</Button>
                            </div>
                         }

                    </div>
                </div>
                <Messages messages={current.messages} />
            </div>
        )
    }

}
