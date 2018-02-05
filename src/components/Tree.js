import React, { Component } from 'react';
import TreeDrawer from '../classes/TreeDrawer'
import Word from './Word'
import Relation from './Relation'
import Line from './Line'
import equal from 'equals'

class Tree extends Component {

    constructor(props) {
        super(props)

        const rem = parseFloat(window.getComputedStyle(document.body).getPropertyValue('font-size'))

        this.state = {
            sentence: props.sentence,
            nodes: [],
            scaling: {
                rem,
                units: {x: 0, y: 10*rem},
                wordWidth: 0
            },
            element: null
        }

        this.animation = {
            element: null,
            rectangle: null,
            mouse: {x: 0, y: 0},
            ids: []
        }

        this.layout(props)
    }

    componentWillReceiveProps(nextProps) {
        //Only re-generate tree layout if sentence has changed
        if (!equal(nextProps.sentence, this.state.sentence)) {
            this.layout(nextProps)
        }

        if (nextProps.relation) {
            this.animation.element.addEventListener('mousemove', this.updateMousePosition.bind(this))
        } else {
            this.animation.element.removeEventListener('mousemove', this.updateMousePosition.bind(this))
            this.stopAnimation()
        }

        this.setState({
            sentence: nextProps.sentence
        })
    }

    componentDidMount() {
        this.updateDimensions()
        window.addEventListener("resize", this.updateDimensions.bind(this))
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions.bind(this))
        this.stopAnimation()
    }

    updateDimensions() {
        this.animation.rectangle = this.animation.element.getBoundingClientRect()
    }

    updateMousePosition(event) {
        this.animation.mouse.x = event.clientX - this.animation.rectangle.x
        this.animation.mouse.y = event.clientY - this.animation.rectangle.y
    }

    followMouse(ref) {
        console.log('followMouse', this)
        const self = this

        const animate = () => {
            console.log('animate', ref)
            ref.setAttribute('x1', self.animation.mouse.x)
            ref.setAttribute('y1', self.animation.mouse.y)
            window.requestAnimationFrame(animate)
        }

        const animationID = requestAnimationFrame(animate)
        this.animation.ids.push(animationID)
    }

    stopAnimation() {
        this.animation.ids.forEach(id => cancelAnimationFrame(id))
        this.animation.ids = []
    }

    //Calculate co-ordinates
    layout(props) {
        const { sentence, word, relation, actions } = props
        const { rem } = this.state.scaling

        if (!sentence) return

        //Scale x unit to longest word
        let longestWord = 0
        for (let index in sentence.words) {
          if (sentence.words[index].inflection.length > longestWord) longestWord = sentence.words[index].inflection.length
        }
        const wordWidth = Math.max(longestWord * rem, 10 * rem) //At least 10rem
        const xUnit = wordWidth * 1.33 //Extra padding

        //Calculate node positions
        let tree = new TreeDrawer(sentence)
        tree.positionNodes()
        const nodes = tree.nodes

        this.setState(prevState => {
            let newState = Object.assign({}, prevState)
            newState.nodes = nodes
            newState.scaling.units.x = xUnit
            newState.scaling.wordWidth = wordWidth
            return newState
        })
    }

    render() {
        const { actions, word, relation } = this.props
        const { nodes, scaling, origin } = this.state

        //Generate words
        const words = nodes.map(node => {
            const editable = node.index == word ? true : false
            return <Word {...node} scaling={scaling} actions={actions} key={node.index} editable={editable} />
        })

        //Generate lines & relations
        let lines = []
        let relations = []
        nodes.forEach(node => {
            //Draw lines from parent to child
            node.children.forEach(child => {
                //Line
                let coords = {};
                //Line start co-ordinate
                coords.x1 = node.x * scaling.units.x + (scaling.wordWidth/2)
                coords.y1 = node.y * scaling.units.y + scaling.rem
                //Line end co-ordinate
                coords.x2 = child.x * scaling.units.x + (scaling.wordWidth/2)
                coords.y2 = child.y * scaling.units.y + scaling.rem
                //Follow mouse if active relation
                const active = Number(relation) === Number(child.index)
                lines.push(<Line {...coords} active={active} followMouse={this.followMouse.bind(this)} key={child.index} />)

                //Relation
                relations.push(<Relation coords={coords} word={child.word} actions={actions} key={child.index} />)
            })
        })

        //Deselect when user clicks outside subelements
        const handleClick = event => {
            actions.setWord()
        }

        return (
            <div className="tree" ref={element => this.animation.element = element} onClick={handleClick}>
                <svg className="lines">{lines}</svg>
                <div className="relations">{relations}</div>
                {words}
            </div>
        )
    }

}

export default Tree;
