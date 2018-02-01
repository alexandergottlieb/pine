import React, { Component } from 'react';
import TreeDrawer from '../classes/TreeDrawer'
import Word from './Word'
import Relation from './Relation'
import Line from './Line'

class Tree extends Component {

    constructor(props) {
        super(props)

        this.state = {
            tree: null,
            treeX: 0,
            treeY: 0,
            mouseX: 0,
            mouseY: 0
        }
    }

    render() {
        const self = this
        const { sentence, word, relation, actions } = this.props

        let words = []
        let lines = []
        let relations = []

        //Drawing calculations
        if (sentence) {
            //Scaling factors
            const rem = parseFloat(window.getComputedStyle(document.body).getPropertyValue('font-size'))
            const yUnit = 10 * rem
            let longestWord = 0
            for (let index in sentence.words) {
              if (sentence.words[index].inflection.length > longestWord) longestWord = sentence.words[index].inflection.length
            }
            const wordWidth = Math.max(longestWord * rem, 10 * rem) //At least 10rem
            const xUnit = wordWidth * 1.33 //relative to the longest word, scaled to add padding

            //Calculate node positions
            let tree = new TreeDrawer(sentence)
            tree.positionNodes()
            let nodes = tree.nodes

            //Generate words
            words = nodes.map(node => {
                const editable = node.index == word ? true : false
                return <Word {...node} xUnit={xUnit} yUnit={yUnit} width={wordWidth} actions={actions} key={node.index} editable={editable} />
            })

            //Generate lines & relations
            nodes.forEach(node => {
              //Draw lines from parent to child
              node.children.forEach(child => {
                let coords = {};
                //Line start co-ordinate
                coords.x1 = child.index != relation ? node.x * xUnit + (wordWidth/2) : self.state.mouseX
                coords.y1 = child.index != relation ? node.y * yUnit + rem : self.state.mouseY
                //Line end co-ordinate
                coords.x2 = child.x * xUnit + (wordWidth/2)
                coords.y2 = child.y * yUnit + rem
                const key = `${node.index}_${child.index}`
                lines.push(<Line {...coords} key={key} />)
                //Relation
                relations.push(<Relation coords={coords} word={child.word} actions={actions} key={child.index} />)
              })
            })
        }

        const handleClick = event => {
            actions.setWord() //Deselect active word
        }

        const mouseMove = event => {
            this.setState({
                mouseX: event.pageX - this.treeX,
                mouseY: event.clientY - this.treeY
            })
        }

        return (
            <div className="tree" ref={tree => this.tree = tree} onClick={handleClick} onMouseMove={mouseMove}>
                <svg className="lines">{lines}</svg>
                <div className="relations">{relations}</div>
                {words}
            </div>
        )
    }

    componentDidMount() {
        const rect = this.tree.getBoundingClientRect()
        this.treeX = rect.left
        this.treeY = rect.top
    }

}

export default Tree;
