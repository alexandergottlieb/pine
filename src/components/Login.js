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
            name: "",
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

    changeName(value) {
        this.setState({
            name: value
        })
    }

    login() {
        const { actions } = this.props
        const { email, password } = this.state
        if (email.length > 0 && password.length > 0) actions.login(email, password)
    }

    forgotPassword() {
        const { actions } = this.props
        const email = prompt("Enter your email to reset your password", this.state.email)
        if (email) {
            actions.forgotPassword(email)
        }
    }

    register() {
        const { actions } = this.props
        const { email, password, name } = this.state
        console.log('register clicked', email, password, name)
        //TODO - validation
        if (email.length > 0 && password.length > 0 && name.length > 0) actions.register(email, password, name)
    }

    toggleRegister() {
        this.setState({
            register: !this.state.register
        })
    }

    keyUp(event) {
        if (event.keyCode === 13) {
            if (this.state.register) {
                this.register()
            } else {
                this.login()
            }
        }
    }

    render() {
        const { current } = this.props
        const { register } = this.state
        return (
            <div className="login">
                <div className="login__form" onKeyUp={this.keyUp.bind(this)}>
                    <h1>{register ? "Register" : "Sign In"}</h1>
                    <small>or <a onClick={this.toggleRegister.bind(this)}>{register ? "Sign In" : "Register"}</a></small>
                    <Input type="email" label="Email" onChange={val => this.changeEmail(val)} />
                    <Input type="password" label="Password" onChange={val => this.changePassword(val)} />
                    {register
                        ? <Input type="text" label="Name" onChange={val => this.changeName(val)} />
                        : null
                    }
                    <div className="login__buttons">
                        {register
                            ? <Button type="primary" onClick={this.register.bind(this)}>Register</Button>
                            : <div>
                                <a className="login__forgot" onClick={this.forgotPassword.bind(this)}>Forgot password?</a>
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
