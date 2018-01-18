import React, { Component } from 'react'
import Tree from '../classes/Tree'
import Word from './Word'
import Sidebar from './Sidebar'

class Editor extends Component {

  constructor(props) {
    super(props)

    let { sentence } = props

    //Scaling factors
    const pixelUnit = 16
    const yUnit = 6 * pixelUnit
    let longestWord = 0
    for (let index in sentence.words) {
      if (sentence.words[index].word.length > longestWord) longestWord = sentence.words[index].word.length
    }
    const wordWidth = longestWord * pixelUnit
    const xUnit = wordWidth * 3 //relative to the longest word, scaled to add padding

    //Calculate node positions
    let tree = new Tree(sentence)
    tree.positionNodes()
    let nodes = tree.nodes

    //Generate words
    let words = nodes.map(node => { return <Word {...node} xUnit={xUnit} yUnit={yUnit} width={wordWidth} key={node.index} /> })

    //Generate lines
    let lines = []
    //Draw parent/head relation for each node
    nodes.forEach(node => {
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
      <div>
        <Sidebar treebank={this.props.treebank} />
        <div className="editor">
          <div className="tree">
            <svg className="tree__lines">{this.state.lines}</svg>
            {this.state.words}
          </div>
        </div>
      </div>
    )
  }
}

export default Editor
