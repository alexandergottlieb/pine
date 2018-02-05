import React, { Component } from 'react'

class Line extends Component {

    render() {
        const { x1, y1, x2, y2, active } = this.props

        return <line x1={x1} x2={x2} y1={y1} y2={y2} strokeWidth="2" stroke="#78797B" ref={element => this.element = element} />
    }

}

export default Line;
