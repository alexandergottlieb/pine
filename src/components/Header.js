import React, { Component } from "react"
import Button from "./Button"
import "../css/Header.css"
import { name as APP_NAME } from "../../package.json"

const Header = props => {

    const { current, user, actions } = props

    return (
        <header className="header">
            <h1 className="header__title"><span className="fa fa-tree"></span> {APP_NAME}</h1>
            <div className="header__meta">
                <p className="header__username">{user.displayName}</p>
                <Button className="header__logout" type="secondary" icon="fa-user-circle" onClick={actions.logout}>Sign Out</Button>
            </div>
        </header>
    )

}

export default Header
