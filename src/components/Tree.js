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
            nodes: [],
            scaling: {
                rem,
                units: {x: 0, y: 10*rem},
                wordWidth: 0
            },
            origin: {x: 0, y: 0}
        }

        this.children = {
            lines: [],
            relations: []
        }

        this.mouse = {x:0, y:0}

        this.layout(props)
    }

    componentWillReceiveProps(nextProps) {
        //Only re-generate tree layout if sentence has changed
        if (!equal(nextProps.sentence, this.props.sentence)) {
            this.layout(nextProps)
        }
    }

    componentWillUnmount() {
        this.cancelAnimation()
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

    //Active relation line should follow mouse
    animate() {
        const { relation } = this.props

        const container = document.getElementById('tree')
        const rect = document.getElementById('lines').getBoundingClientRect()
        const line = this.children.lines[relation].element
        this.captureMouse()

        const frame = () => {
            line.setAttribute('x1', this.mouse.x + container.scrollLeft - rect.x)
            line.setAttribute('y1', this.mouse.y + container.scrollTop - rect.y)
            this.animationID = window.requestAnimationFrame(frame.bind(this))
        }

        this.animationID = requestAnimationFrame(frame.bind(this))
    }

    cancelAnimation() {
        cancelAnimationFrame(this.animationID)
        this.releaseMouse()
    }

    captureMouse() {
        document.body.addEventListener('mousemove', this.trackMouse.bind(this))
    }

    trackMouse(event) {
        this.mouse.x = event.clientX
        this.mouse.y = event.clientY
    }

    releaseMouse() {
        document.body.removeEventListener('mousemove', this.trackMouse.bind(this))
    }

    registerLine(element, childIndex) {
        this.children.lines[childIndex] = element
    }

    registerRelation(element, childIndex) {
        this.children.relations[childIndex] = element
    }

    //Deselect when user clicks outside subelements
    handleClick() {
        const { actions } = this.props
        actions.setWord()
        actions.setRelation()
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
                //Active if user is moving relation line of current child
                const active = relation == child.index

                //Line
                let coords = {};
                //Line start co-ordinate
                coords.x1 = node.x * scaling.units.x + (scaling.wordWidth/2)
                coords.y1 = node.y * scaling.units.y + scaling.rem
                //Line end co-ordinate
                coords.x2 = child.x * scaling.units.x + (scaling.wordWidth/2)
                coords.y2 = child.y * scaling.units.y + scaling.rem
                lines.push(<Line {...coords} active={active} key={child.index} ref={element => this.registerLine(element, child.index)} />)

                //Relation
                relations.push(<Relation coords={coords} word={child.word} actions={actions} active={active} key={child.index} ref={element => this.registerRelation(element, child.index)} />)
            })
        })

        if (relation) {
            this.animate()
        } else {
            this.cancelAnimation()
        }

        return (
            <div id="tree" className="tree" onClick={this.handleClick.bind(this)}>
                <svg id="lines" className="lines">{lines}</svg>
                <div className="relations">{relations}</div>
                {words}
            </div>
        )
    }

}

export default Tree;
