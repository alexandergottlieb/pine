import React, { Component } from 'react'
import Tree from '../classes/Tree'
import Word from './Word'

class Editor extends Component {

  constructor(props) {
    super(props)

    let {sentence} = props

    //Scaling factors
    const pixelUnit = 16
    const yUnit = 6 * pixelUnit
    let longestWord = 0
    for (let index in sentence) {
      if (sentence[index].word.length > longestWord) longestWord = sentence[index].word.length
    }
    const wordWidth = longestWord * pixelUnit
    const xUnit = wordWidth * 3 //relative to the longest word, scaled to add padding

    //Calculate node positions
    let tree = new Tree(sentence)
    tree.positionNodes()
    let nodes = []
    tree.breadthFirst(node => { nodes.push(node) })

    //Generate words
    let words = nodes
    words = words.map(word => { return <Word {...word} xUnit={xUnit} yUnit={yUnit} width={wordWidth} key={word.index} /> })

    //Generate lines
    let lines = []
    //Draw parent/head relation for each node
    tree.breadthFirst(node => {
      //Draw lines from parent to child
      node.children.forEach(child => {
        let coords = {};
        //Line start co-ordinate
        coords.x1 = node.x * xUnit + (wordWidth/2);
        coords.y1 = node.y * yUnit + pixelUnit;
        //Line end co-ordinate
        coords.x2 = child.x * xUnit + (wordWidth/2);
        coords.y2 = child.y * yUnit + pixelUnit;
        console.log(coords);
        const key = `${node.index}_${child.index}`
        lines.push(<line {...coords} strokeWidth="2" stroke="#727272" key={key}/>)
      })
    })

    this.state = {words, lines}
  }

  render() {
    return (
      <div className="editor">
        <div className="tree">
          <svg className="tree__lines">{this.state.lines}</svg>
          {this.state.words}
        </div>
      </div>
    )
  }
}

export default Editor
