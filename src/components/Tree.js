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

    //Deselect when user clicks outside subelements
    deselect() {
        const { actions, current } = this.props
        if (current.relations) actions.clearRelations()
        if (current.word) actions.setWord()
    }

    clickRoot() {
        const { current, actions } = this.props
        try {
            if (current.relations.length > 1) throw "Only one word descends from root."
            current.relations.forEach(childIndex => {
                this.editWord(childIndex, {
                    parent: 0
                })
            })
        } catch (errorMessage) {
            actions.addError(errorMessage)
        }
    }

    editWord(wordIndex, data) {
        const { sentence, current, actions } = this.props
        const editedSentence = new Sentence(sentence)

        //If assigning new root, set current root to descend from the new
        const oldRoot = (data.hasOwnProperty("parent") && data.parent === 0) ? editedSentence.rootWord() : null
        if (oldRoot) oldRoot.parent = wordIndex

        Object.assign(editedSentence.wordByIndex(wordIndex), data)

        //Validate sentence & update
        try {
            console.log('validating', editedSentence.words)
            editedSentence.validate()
            const wordID = sentence.wordByIndex(wordIndex).id
            if (oldRoot) {
                //Edit old root & word
                actions.editWords(current.treebank, current.sentence, editedSentence.words)
            } else {
                //Edit word
                actions.editWord(current.treebank, current.sentence, wordID, data)
            }
            //Edit sentence
            editedSentence.stringSentenceTogether()
            //Update sentence.sentence
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

    deleteWord(word) {
        const { actions, current, sentence } = this.props
        let editedSentence = new Sentence(sentence)
        //Remove word
        editedSentence.words = editedSentence.words.filter(aWord => aWord.id !== word.id)
        //Change order & relations
        let newParent = word.parent > word.index ? word.parent - 1 : word.parent
        editedSentence.words = editedSentence.words.map(aWord => {
            //Shift indices of all words after the deleted word down 1
            if (aWord.index > word.index) aWord.index--
            if (aWord.parent > word.index) aWord.parent--
            if (aWord.parent === word.index) {
                //Only one word can descend from root, so attach to sibling if multiple words
                if (newParent === 0) {
                    newParent = aWord.index
                    aWord.parent = 0
                } else {
                    aWord.parent = newParent
                }
            }
            return aWord
        })
        //Update words
        actions.editWords(current.treebank, current.sentence, editedSentence.words)
        //Update sentence text
        editedSentence.stringSentenceTogether()
        actions.editSentence(current.treebank, current.sentence, {
            sentence: editedSentence.sentence
        })
    }

    render() {
        const { actions, current } = this.props
        const { nodes, scaling, origin } = this.state

        //Generate words
        const words = nodes.map(node => {
            const editable = node.index == current.word ? true : false
            return <Word {...node}
                scaling={scaling}
                editWord={this.editWord.bind(this)}
                deleteWord={this.deleteWord.bind(this)}
                actions={actions}
                current={current}
                editable={editable}
                key={node.word.id}
            />
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
                lines.push(<Line {...coords} active={active} key={child.word.id} ref={element => this.registerLine(element, child.index)} />)

                //Relation
                relations.push(<Relation coords={coords} word={child.word} editWord={this.editWord.bind(this)} addRelation={actions.addRelation} active={active} key={child.word.id} ref={element => this.registerRelation(element, child.index)} />)
            })
        })

        const rootNode = nodes.find(node => node && node.parent === 0)
        const rootStyle = rootNode ? {
            top: rootNode.y * scaling.units.y + "px",
            left: rootNode.x * scaling.units.x + scaling.wordWidth/2 + "px"
        } : {top: "0px", left: "0px"};

        const treeClasses = ["tree"]

        if (current.relations && current.relations.length > 0) {
            this.animate()
            treeClasses.push("tree--with-relations")
        } else {
            this.cancelAnimation()
        }


        return (
            <div className={treeClasses.join(' ')} onClick={this.deselect.bind(this)} ref={element => this.element = element}>
                <svg id="lines" className="lines">{lines}</svg>
                <div className="relations">
                    {relations}
                    <div className="tree__root" onClick={this.clickRoot.bind(this)} style={rootStyle}>root</div>
                </div>
                {words}
            </div>
        )
    }

}

export default Tree;
