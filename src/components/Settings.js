import React from 'react'
import Button from './Button'
import '../css/Settings.css'

const Settings = props => {
    const { current, treebank, actions } = props

    const deleteClick = () => {
        if (window.confirm(`Delete Treebank\n\n'${treebank.name}' will be permanently removed.`)) actions.deleteTreebank(current.treebank)
    }

    return (
        <div className="settings">
            <h2>Settings</h2>
            <h3>Delete Treebank</h3>
            <p>Delete '{treebank.name}' and all its data. This cannot be undone.</p>
            <Button type="warning" onClick={deleteClick} icon="fa-trash">Delete</Button>
        </div>
    )
}

export default Settings
