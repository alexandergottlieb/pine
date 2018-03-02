import React, { Component } from "react"
import Button from "./Button"

const Header = props => {

    const { current, user, actions } = props

    return (
        <header className="header">
            {/* <h1 className="header__title">Treebanker</h1> */}
            <p className="header__username">{user.displayName}</p>
            <Button className="header__logout" type="secondary" onClick={actions.logout}>Sign Out</Button>
        </header>
    )

}

export default Header
