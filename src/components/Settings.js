import React from 'react'
import Button from './Button'
import '../css/Settings.css'

const Settings = props => {
    const { current, actions } = props

    const deleteClick = () => {
        actions.deleteTreebank(current.treebank)
    }

    return (
        <div className="settings">
            <h2>Settings</h2>
            <Button type="warning" onClick={deleteClick} icon="fa-trash">Delete</Button>
        </div>
    )
}

export default Settings
