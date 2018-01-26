import React from 'react';
import TreeDrawer from '../classes/TreeDrawer'
import Word from './Word'

const Tree = props => {

    const { sentence, word, actions } = props;

    let words = []
    let lines = []
    let relations = []

    //Drawing calculations
    if (sentence) {
        //Scaling factors
        const rem = parseFloat(window.getComputedStyle(document.body).getPropertyValue('font-size'))
        const yUnit = 8 * rem
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
            coords.x1 = node.x * xUnit + (wordWidth/2);
            coords.y1 = node.y * yUnit + rem;
            //Line end co-ordinate
            coords.x2 = child.x * xUnit + (wordWidth/2);
            coords.y2 = child.y * yUnit + rem;
            const key = `${node.index}_${child.index}`
            lines.push(<line {...coords} strokeWidth="2" stroke="#78797B" key={key} />)
            //Relation at midpoint of line
            const relationStyle = {
                left: coords.x1 + ((coords.x2 - coords.x1) / 2) + 'px',
                top: coords.y1 + ((coords.y2 - coords.y1) / 2) + 'px'
            }
            relations.push(<span className="relation" style={relationStyle} key={child.index}>{child.word.relation}</span>)
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
