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
            origin: {x: 0, y: 0}
        }

        this.layout(props)
    }

    componentWillReceiveProps(nextProps) {
        //Only re-generate tree layout if sentence has changed
        if (!equal(nextProps.sentence, this.state.sentence)) {
            this.layout(nextProps)
        }
        this.setState({
            sentence: nextProps.sentence
        })
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
            console.log('newState', newState)
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
                const key = `${node.index}_${child.index}`
                lines.push(<Line {...coords} origin={origin} active={active} key={key} />)

                //Relation
                relations.push(<Relation coords={coords} word={child.word} actions={actions} active={active} key={child.index} />)
            })
        })

        //Deselect when user clicks outside subelements
        const handleClick = event => {
            actions.setWord()
        }

        return (
            <div className="tree" onClick={handleClick}>
                <svg id="lines" className="lines">{lines}</svg>
                <div className="relations">{relations}</div>
                {words}
            </div>
        )
    }

    componentDidMount() {
        const rect = document.getElementById('lines').getBoundingClientRect()
        this.setState({
            origin: {
                x: rect.left,
                y: rect.top
            }
        })
    }

}

export default Tree;
