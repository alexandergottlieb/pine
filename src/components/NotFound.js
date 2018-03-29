import React, { Component } from "react"
import Button from "./Button"
import "../css/NotFound.css"

const NotFound = props => {
    return <div className="not-found">
        <div className="not-found__inner">
            <span className="fa fa-5x fa-map-signs"></span>
            <h1 className="not-found__title">Not Found</h1>
            <p>Page intentionally left blank.</p>
            <Button link="/" type="primary">Go home</Button>
            <pre className="not-found__code">404</pre>
        </div>
    </div>
}

export default NotFound
