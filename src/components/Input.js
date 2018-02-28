import React, { Component } from "react"
import "../css/Input.css"

export default class Edit extends Component {

    constructor(props) {
        super(props)

        this.state = {

        }
    }

    handleChange(event) {
        const { onChange } = this.props
        this.setState({
            input: event.target.value
        })
        if (onChange) onChange(event.target.value)
    }

    render() {
        const { type, label } = this.props

        return (
            <div className="input">
                <label className="input__label">{label}</label>
                <input
                    className="input__input"
                    type={type}
                    value={this.state.input}
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        )
    }
}
