import React from 'react'
import Button from './Button'
import '../css/Settings.css'

const Settings = props => {
    const { current, treebanks, actions } = props
    const treebank = treebanks[current.treebank] || {name: ''}

    const deleteClick = () => {
        actions.deleteTreebank(current.treebank)
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
