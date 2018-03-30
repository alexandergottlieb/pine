import React, { Component } from "react"
import Button from './Button'
import * as EmailValidator from "email-validator"
import "../css/Share.css"

export default class Share extends Component {

    constructor(props) {
        super(props)

        this.state = {
            email: ""
        }
    }

    componentDidMount = () => {
        const { actions, treebank } = this.props
        actions.fetchPermissions(treebank.id)
    }

    changeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    share = () => {
        const { actions, treebank, permissions } = this.props
        try {
            //Validate email
            if (!this.state.email) throw new Error("Please enter an email")
            if (!EmailValidator.validate(this.state.email)) throw new Error("That email doesn't look right.")
            //Check user is not already added
            permissions.forEach(user => {
                if (user.email === this.state.email) throw new Error(`This treebank is already shared with ${this.state.email}'`)
            })
            actions.shareTreebank(treebank, this.state.email)
        } catch (e) {
            actions.addError(e.message)
        }
    }

    unshare = (user) => {
        const { actions, treebank } = this.props
        actions.unshareTreebank(treebank, user)
    }

    render = () => {
        const { permissions } = this.props

        const people = permissions.map(user => {
            const remove = user.role !== 'owner' ? <Button onClick={() => this.unshare(user)} icon="fa-times-circle"></Button> : null
            return (
                <tr className={`share__user share__user--role-${user.role.toLowerCase()}`} key={user.uid}>
                    <td>
                        <span className="share__user-name">{user.displayName}</span>
                        <span className="share__user-email">{user.email}</span>
                    </td>
                    <td className="share__user-role">{user.role}</td>
                    <td className="share__user-remove">{remove}</td>
                </tr>
            )
        })

        return (
            <div className="share">
                <table className="share__users">
                    <tbody>{people}</tbody>
                </table>
                <input className="share__add-email" onChange={this.changeEmail} onKeyUp={(e) => { if (e.keyCode === 13) this.share(e) }} placeholder="Enter email to share..." type="email" />
                <Button onClick={this.share} type="primary" icon="fa fa-user-plus">Share</Button>
            </div>
        )
    }

}
