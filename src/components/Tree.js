import React, { Component } from 'react';
import TreeDrawer from '../classes/TreeDrawer'
import Sentence from '../classes/Sentence'
import Word from './Word'
import Relation from './Relation'
import Line from './Line'
import '../css/Tree.css'

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

        if (!sentence || sentence.words.length === 0) return

        //Scale x unit to longest word
        let longestWord = 0
        for (let index in sentence.words) {
          if (sentence.words[index].inflection.length > longestWord) longestWord = sentence.words[index].inflection.length
        }
        const wordWidth = 10 * rem //Math.max(longestWord * rem * 0.7, 10 * rem) //At least 10rem
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
        const self = this
        const { relations } = this.props.current

        const container = this.element
        const rect = container.getBoundingClientRect()
        //Add padding
        rect.x += 2 * this.state.scaling.rem
        rect.y += 2 * this.state.scaling.rem
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

    //Deselect when user clicks outside subelements
    deselect() {
        const { actions, current } = this.props
        if (current.relations) actions.clearRelations()
        if (current.word) actions.setWord()
    }

    editWord(wordIndex, data) {
        const { sentence, current, actions } = this.props
        const editedSentence = new Sentence(sentence)
        Object.assign(editedSentence.words[wordIndex], data)

        try {
            //Validate sentence
            editedSentence.validate()
            //Edit word
            actions.editWord(current.treebank, current.sentence, wordIndex, data)
            //Edit sentence
            editedSentence.stringSentenceTogether()
            actions.editSentence(current.treebank, current.sentence, {
                sentence: editedSentence.sentence
            })
        } catch (errorMessage) {
            if (typeof errorMessage === "string") {
                actions.addError(errorMessage)
            } else { //Unexpected error
                throw errorMessage
            }
        }
    }

    render() {
        const { actions, current } = this.props
        const { nodes, scaling, origin } = this.state

        //Generate words
        const words = nodes.map(node => {
            const editable = node.index == current.word ? true : false
            return <Word {...node} scaling={scaling} editWord={this.editWord.bind(this)} actions={actions} current={current} editable={editable} key={`${current.sentence}_${node.index}`} />
        })

        //Generate lines & relations
        let lines = []
        let relations = []
        nodes.forEach(node => {
            //Draw lines from parent to child
            node.children.forEach(child => {
                //Active if user is moving relation line of current child
                const active = current.relations.indexOf(child.index) !== -1

                //Line
                let coords = {};
                //Line start co-ordinate
                coords.x1 = node.x * scaling.units.x + (scaling.wordWidth/2)
                coords.y1 = node.y * scaling.units.y + scaling.rem
                //Line end co-ordinate
                coords.x2 = child.x * scaling.units.x + (scaling.wordWidth/2)
                coords.y2 = child.y * scaling.units.y + scaling.rem
                lines.push(<Line {...coords} active={active} key={`${current.sentence}_${child.index}`} ref={element => this.registerLine(element, child.index)} />)

                //Relation
                relations.push(<Relation coords={coords} word={child.word} editWord={this.editWord.bind(this)} addRelation={actions.addRelation} active={active} key={`${current.sentence}_${child.index}`} ref={element => this.registerRelation(element, child.index)} />)
            })
        })

        if (current.relations && current.relations.length > 0) {
            this.animate()
        } else {
            this.cancelAnimation()
        }

        return (
            <div className="tree" onClick={this.deselect.bind(this)} ref={element => this.element = element}>
                <svg id="lines" className="lines">{lines}</svg>
                <div className="relations">{relations}</div>
                {words}
            </div>
        )
    }

}

export default Tree;
