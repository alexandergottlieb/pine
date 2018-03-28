import React, { Component } from 'react'
import { version } from "../../package.json"

const Version = (props) => {
    return (
        <div class="version">
            <small>Treebanker v{version}</small>
        </div>
    )
}

export default Version
