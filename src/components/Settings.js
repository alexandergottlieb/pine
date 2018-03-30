import React, { Component } from 'react'
import Button from './Button'
import Share from "./Share"
import Messages from "./Messages"
import '../css/Settings.css'

export default class Settings extends Component {

    deleteClick = () => {
        const { actions, treebank } = this.props
        if (window.confirm(`Delete Treebank\n\n'${treebank.name}' will be permanently removed.`)) actions.deleteTreebank(treebank.id)
    }

    render() {
        const { current, treebank, actions, permissions } = this.props

        return (
            <div className="settings">
                <h2>Settings</h2>
                <Messages messages={current.messages} />
                <h3>Sharing</h3>
                <Share permissions={permissions} actions={actions} treebank={treebank} />
                <h3>Delete Treebank</h3>
                <p>Delete '{treebank.name}' and all its data. This cannot be undone.</p>
                <Button type="warning" onClick={this.deleteClick} icon="fa-trash">Delete</Button>
            </div>
        )
    }

}
