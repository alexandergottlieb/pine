import React, { Component } from 'react'
import { version } from "../../package.json"

const Version = (props) => {
    return (
        <div className="version">
            <small>Treebanker v{version}</small>
        </div>
    )
}

export default Version
