import React, { Component } from 'react'

const Line = props => {

    const { x1, x2, y1, y2, origin, active } = props

    let ref = null

    //Follow mouse when active
    if (active) {
        let mouseX = x1
        let mouseY = y1
        console.log('mouseX init', mouseX)
        console.log('mouseY init', mouseY)
        document.body.addEventListener('mousemove', event => {
            mouseX = event.clientX - origin.x
            mouseY = event.clientY - origin.y
        })
        document.body.dispatchEvent(new Event('mousemove')) //Initialise position)

        const animate = () => {
            console.log('mouseX', mouseX)
            console.log('mouseY', mouseY)
            ref.setAttribute('x1', mouseX)
            ref.setAttribute('y1', mouseY)
            window.requestAnimationFrame(animate)
        }

        window.requestAnimationFrame(animate)
    }

    return <line x1={x1} x2={x2} y1={y1} y2={y2} strokeWidth="2" stroke="#78797B" ref={element => ref = element} />
}

export default Line;
