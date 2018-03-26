import React, { Component } from 'react';
import Word from './Word'
import Relation from './Relation'
import '../css/Arc.css'

class Arc extends Component {

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

        this.animations = []

        this.mouse = {x:0, y:0}

        this.element = null
    }

    componentWillReceiveProps(nextProps) {
        this.layout(nextProps)
    }

    componentDidMount() {
        this.layout(this.props)
        this.captureMouse()
    }

    componentWillUnmount() {
        this.cancelAnimation()
        this.releaseMouse()
    }

    //Calculate co-ordinates
    layout(props) {
        const { actions, current, sentence } = props
        const { rem } = this.state.scaling

        //Scale x unit to longest word
        let longestWord = 0
        sentence.words.forEach( word => {
          if (word.inflection.length > longestWord) longestWord = word.inflection.length
        })
        const wordWidth = 10 * rem //Math.max(longestWord * rem * 0.7, 10 * rem) //At least 10rem
        const xUnit = wordWidth * 1.4 //Extra padding

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
        const self = this
        const { relations } = this.props.current

        const container = this.element
        const rect = container.getBoundingClientRect()
        //Add padding
        rect.x += 2 * this.state.scaling.rem
        rect.y += 4 * this.state.scaling.rem
        const lines = this.children.lines.filter((line, index) => relations.indexOf(index) !== -1)

        lines.forEach((line, index) => {
            //Define animation
            const frame = () => {
                line.element.setAttribute('x1', self.mouse.x + container.scrollLeft - rect.x)
                line.element.setAttribute('y1', self.mouse.y + container.scrollTop - rect.y)
                self.animations[index] = window.requestAnimationFrame(frame)
            }
            //Clear any existing animation
            window.cancelAnimationFrame(self.animations[index])
            //Start animation
            self.animations[index] = window.requestAnimationFrame(frame)
        })
    }

    cancelAnimation() {
        this.animations.forEach(id => window.cancelAnimationFrame(id))
        this.animations = []
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

    render() {
        const { actions, current, treebank, editWord, deleteWord, deselect, zoom } = this.props
        const { nodes, scaling, origin } = this.state

        //Scale and translate so that zoom aligns left
        const translateToLeft = - ( ( (1 - zoom) / 2 ) / zoom ) * 100
        const magnifierStyle = {transform: `scale(${zoom}) translateX(${translateToLeft}%)`}

        return (
            <div className="arc" onClick={deselect} ref={element => this.element = element}>
                <div className="arc__magnifier" style={magnifierStyle}>
                    <svg id="lines" className="lines">{lines}</svg>
                    <div className="relations">
                        {relations}
                        <div className="tree__root" onClick={this.clickRoot.bind(this)} style={rootStyle}>root</div>
                    </div>
                    {words}
                </div>
            </div>
        )
    }

}

export default Arc;
