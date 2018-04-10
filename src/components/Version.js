import React, { Component } from 'react'
import { version } from "../../package.json"

const Version = (props) => {
    return <small className="version">{process.env.REACT_APP_NAME} v{version}</small>
}

export default Version
