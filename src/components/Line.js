import React, { Component } from 'react'

class Line extends Component {

    constructor(props) {
        super(props)

        this.state = {
            mouseX: 0,
            mouseY: 0,
            animationID: null
        }
    }

    componentWillReceiveProps(newProps) {
        const { active, x1, y1, origin } = newProps

        //Follow mouse when active
        if (active) {
            let mouseX = x1
            let mouseY = y1
            document.body.addEventListener('mousemove', event => {
                mouseX = event.clientX - origin.x
                mouseY = event.clientY - origin.y
            })

            const animate = () => {
                console.log('animate')
                this.setState({ mouseX, mouseY })
                window.requestAnimationFrame(animate)
            }

            const animationID = requestAnimationFrame(animate)
            this.setState({animationID})
        } else {
            cancelAnimationFrame(this.state.animationID)
        }
    }

    render() {
        const { x2, y2, active } = this.props

        const x1 = active ? this.state.mouseX : this.props.x1
        const y1 = active ? this.state.mouseY : this.props.y1

        return <line x1={x1} x2={x2} y1={y1} y2={y2} strokeWidth="2" stroke="#78797B" />
    }
}

export default Line;
