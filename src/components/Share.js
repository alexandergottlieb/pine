import React, { Component } from "react"
import Button from './Button'
import * as EmailValidator from "email-validator"

export default class Share extends Component {

    constructor(props) {
        super(props)

        this.state = {
            email: ""
        }
    }

    componentDidMount = () => {
        const { actions } = this.props
        actions.fetchSharingUsers()
    }

    changeEmail = (event) => {
        this.setState({
            email: event.target.value
        })
    }

    share = () => {
        const { actions, treebank, sharedWith } = this.props
        try {
            //Validate email
            if (!EmailValidator.validate(this.state.email)) throw new Error("That email doesn't look right.")
            //Check user is not already added
            sharedWith.forEach(user => {
                if (user.email === this.state.email) throw new Error(`This treebank is already shared with ${this.state.email}'`)
            })
            actions.shareTreebank(treebank, this.state.email)
        } catch (e) {
            actions.addError(e.message)
        }
    }

    render = () => {
        const { sharedWith } = this.props

        const people = sharedWith.map(user => {
            return <li key={user.uid}>{user.displayName} <small>{user.email}</small></li>
        })

        return (
            <div className="share">
                <h4>People</h4>
                <ul>
                    {people}
                </ul>
                <input onChange={this.changeEmail} onKeyUp={(e) => { if (e.keyCode === 13) this.share(e) }} placeholder="Enter email address to share" type="email" />
                <Button onClick={this.share} type="primary" icon="fa fa-user-plus">Share</Button>
            </div>
        )
    }

}
