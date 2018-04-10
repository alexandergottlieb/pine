import React, { Component } from 'react'
import { version, name as APP_NAME } from "../../package.json"

const Version = (props) => {
    return <small className="version">{APP_NAME} v{version}</small>
}

export default Version
