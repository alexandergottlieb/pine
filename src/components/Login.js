import React, { Component } from "react"
import * as EmailValidator from "email-validator"
import PasswordValidator from "password-validator"
import Input from "./Input"
import Button from "./Button"
import Messages from "./Messages"
import Version from "./Version"
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

        this.passwordValidator = new PasswordValidator()
            .is().min(8)                                    // Minimum length 8
            .has().uppercase()                              // Must have uppercase letters
            .has().lowercase()                              // Must have lowercase letters
            .has().digits()                                 // Must have digits
            .has().not().spaces()                           // Should not have spaces
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
        try {
            //Validate email
            if (!EmailValidator.validate(email)) throw new Error("That email doesn't look right.")
            //Attempt login
            actions.login(email, password)
        } catch (e) {
            actions.addError(e.message)
        }
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
        actions.clearMessages()
        try {
            //Validate email
            if (email.length === 0) throw new Error("Please enter your email.")
            if (!EmailValidator.validate(email)) throw new Error("That email doesn't look right.")
            //Validate password
            if (!this.passwordValidator.validate(password)) {
                if (password.length === 0) throw new Error("Please enter a password.")
                const failedRules = this.passwordValidator.validate(password, { list: true })
                //Generate feedback string
                let feedback = "Please use a password with "
                let i = 0
                failedRules.forEach(rule => {
                    //Insert comma or 'and'
                    switch (i) {
                        case 0:
                            //Skip
                            break
                        case (failedRules.length-1):
                            feedback += " and "
                            break
                        default:
                            feedback += ", "
                    }
                    //Insert rule
                    switch (rule) {
                        case "min":
                            feedback += "at least 8 characters"
                            break
                        case "uppercase":
                            feedback += "an uppercase letter"
                            break
                        case "lowercase":
                            feedback += "a lowercase letter"
                            break
                        case "digits":
                            feedback += "a number"
                            break
                        case "spaces":
                            feedback += "no spaces"
                            break
                        default:
                            feedback += "more security"
                            break
                    }
                    i++
                })
                feedback += "."
                throw new Error(feedback)
            }
            //Validate name
            if (name.length <= 0) throw new Error("Please enter your name.")
            //Register
            actions.register(email, password, name)
        } catch (e) {
            actions.addError(e.message, false)
        }
    }

    toggleRegister() {
        const { actions } = this.props
        this.setState({
            register: !this.state.register
        })
        actions.clearMessages()
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
            <div className="login background-dark">
                <div className="login__form" onKeyUp={this.keyUp.bind(this)}>
                    <h1>{register ? "Register" : "Sign In"}</h1>
                    <small>or <a onClick={this.toggleRegister.bind(this)}>{register ? "Sign In" : "Register"}</a></small>
                    <Messages messages={current.messages} />
                    <Input type="email" label="Email" onChange={val => this.changeEmail(val)} required />
                    <Input type="password" label="Password" onChange={val => this.changePassword(val)} pattern="\S{8,}" required />
                    {register
                        ? <Input type="text" label="Name" onChange={val => this.changeName(val)} required />
                        : null
                    }
                    <div className="login__buttons">
                        {register
                            ? <Button type="primary" icon="fa-arrow-alt-circle-right" onClick={this.register.bind(this)}>Register</Button>
                            : <div>
                                <a className="login__forgot" onClick={this.forgotPassword.bind(this)}>Forgot password?</a>
                                <Button type="primary" icon="fa-arrow-alt-circle-right" onClick={this.login.bind(this)}>Sign In</Button>
                            </div>
                         }
                    </div>
                </div>
                <Version />
            </div>
        )
    }

}
