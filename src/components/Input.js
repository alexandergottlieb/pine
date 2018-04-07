import React, { Component } from "react"
import "../css/Input.css"

export default class Input extends Component {

    constructor(props) {
        super(props)

        this.state = {
            value: ""
        }
    }

    componentDidMount() {
        const { value } = this.props
        if (value) this.setState({value})
    }

    componentWillReceiveProps(props) {
        const { value } = props
        if (value !== this.props.value) this.setState({ value })
    }

    handleChange(event) {
        const { onChange } = this.props
        this.setState({
            value: event.target.value
        })
        if (onChange) onChange(event.target.value)
    }

    render() {
        const { label, className } = this.props

        return (
            <div className={"input "+className}>
                {label ? <label className="input__label">{label}</label> : null}
                <input {...this.props}
                    className="input__input"
                    value={this.state.value}
                    onChange={this.handleChange.bind(this)}
                />
            </div>
        )
    }
}
