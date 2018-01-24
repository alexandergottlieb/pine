import React from 'react';
import TreeDrawer from '../classes/TreeDrawer'
import Word from './Word'

const Tree = props => {

    const {sentence} = props;

    let words = []
    let lines = []
    let relations = []

    //Drawing calculations
    if (sentence) {
        //Scaling factors
        const pixelUnit = 16
        const yUnit = 8 * pixelUnit
        let longestWord = 0
        for (let index in sentence.words) {
          if (sentence.words[index].inflection.length > longestWord) longestWord = sentence.words[index].inflection.length
        }
        const wordWidth = longestWord * pixelUnit
        const xUnit = wordWidth * 1.25 //relative to the longest word, scaled to add padding

        //Calculate node positions
        let tree = new TreeDrawer(sentence)
        tree.positionNodes()
        let nodes = tree.nodes

        //Generate words
        words = nodes.map(node => { return <Word {...node} xUnit={xUnit} yUnit={yUnit} width={wordWidth} key={node.index} /> })

        //Generate lines & relations
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
            const key = `${node.index}_${child.index}`
            lines.push(<line {...coords} strokeWidth="2" stroke="#D2D7DA" key={key} />)
            //Relation at midpoint of line
            const relationStyle = {
                left: coords.x1 + ((coords.x2 - coords.x1) / 2) + 'px',
                top: coords.y1 + ((coords.y2 - coords.y1) / 2) + 'px'
            }
            relations.push(<span className="relation" style={relationStyle}>{child.word.relation}</span>)
          })
        })
    }

    return (
        <div className="tree">
            <svg className="tree__lines">{lines}</svg>
            <div className="tree__relations">{relations}</div>
            {words}
        </div>
    )

}

export default Tree;
