import React from 'react';
import TreeDrawer from '../classes/TreeDrawer'
import Word from './Word'

const Tree = props => {

    const {sentence} = props;

    let words = []
    let lines = []

    //Drawing calculations
    if (sentence) {
        //Scaling factors
        const pixelUnit = 16
        const yUnit = 6 * pixelUnit
        let longestWord = 0
        for (let index in sentence.words) {
          if (sentence.words[index].inflection.length > longestWord) longestWord = sentence.words[index].inflection.length
        }
        const wordWidth = longestWord * pixelUnit
        const xUnit = wordWidth * 2 + (2 * pixelUnit) //relative to the longest word, scaled to add padding

        //Calculate node positions
        let tree = new TreeDrawer(sentence)
        tree.positionNodes()
        let nodes = tree.nodes

        //Generate words
        words = nodes.map(node => { return <Word {...node} xUnit={xUnit} yUnit={yUnit} width={wordWidth} key={node.index} /> })

        //Generate lines
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
            lines.push(<line {...coords} strokeWidth="2" stroke="#727272" key={key}/>)
          })
        })
    }

    return (
        <div className="editor">
            <div className="tree">
                <svg className="tree__lines">{lines}</svg>
                {words}
            </div>
        </div>
    )

}

export default Tree;
