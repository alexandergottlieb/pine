import React, { Component } from 'react'
import debounce from "debounce"
import Treebank from "../classes/Treebank"
import Button from './Button'
import Share from "./Share"
import Messages from "./Messages"
import Input from "./Input"
import '../css/Settings.css'

export default class Settings extends Component {

    deleteClick = () => {
        const { actions, treebank } = this.props
        if (window.confirm(`Delete Treebank\n\n'${treebank.name}' will be permanently removed.`)) actions.deleteTreebank(treebank.id)
    }

    changeRelationLabel = (id, label) => {
        this.debounceChangeRelationLabel(id, label)
    }

    debounceChangeRelationLabel = debounce((id, label) => {
        const { treebank, actions } = this.props
        const { relations } = treebank.settings
        try {
            //Check if duplicate
            if (Object.values(relations).indexOf(label) !== -1) throw new Error(`'${label}' already exists`)
            let editedTreebank = new Treebank(treebank)
            editedTreebank.settings.relations[id] = label
            actions.editTreebank(editedTreebank)
        } catch (e) {
            actions.addError(e.message)
        }
    }, 300)

    render() {
        const { current, treebank, actions, permissions, user } = this.props

        let relationLabels = []
        for (const id in treebank.settings.relations) {
            const label = treebank.settings.relations[id]
            relationLabels.push(<Input className="settings__relation" onChange={value => {this.changeRelationLabel(id, value)}} value={label} key={id} type="text" />)
        }

        return (
            <div className="settings">
                <h2>Settings</h2>
                <Messages messages={current.messages} />
                <h3>Sharing</h3>
                <Share permissions={permissions} actions={actions} treebank={treebank} user={user} />
                <h3>Annotation</h3>
                <h4>Relation Labels</h4>
                <p>Update the names of relations across the treebank.</p>
                <div className="settings__relations">
                    {relationLabels}
                </div>
                <h3>Delete Treebank</h3>
                <p>Delete '{treebank.name}' and all its data. This cannot be undone.</p>
                <Button type="warning" onClick={this.deleteClick} icon="fa-trash">Delete</Button>
            </div>
        )
    }

}
