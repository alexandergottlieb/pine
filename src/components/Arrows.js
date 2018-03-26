import React, { Component } from 'react';
import Word from './Word'
import Relation from './Relation'
import '../css/Arc.css'

class Arrows extends Component {

    render() {
        const { sentence, actions, current, treebank, editWord, deleteWord, deselect, zoom, scaling } = this.props

        const yUnit = 4 * scaling.rem

        //Draw deep enough that relation arrows can be seen
        let depth = 2
        sentence.words.forEach( word => {
            const { index, parent } = word
            const distance = Math.abs(parent - index)
            if (distance > depth) depth = distance
        })
        if (depth > 5) depth = 5
        const y = depth * yUnit

        //Draw arrows & labels
        let relationLabels = []

        const arrows = sentence.words.map( word => {
            let { index, parent } = word
            if (parent === 0) return null //Skip root relation
            //Shift indices to start at 0
            index--
            parent--
            //Distance defines curve height and which side of each word to start/end the line
            const distance = parent - index
            //Start on current word, end on parent
            let x1 = index * scaling.units.x
            let x2 = parent * scaling.units.x + 0.5 * scaling.wordWidth
            //Finish on the parent side closest to child word
            let labelPosition = ''
            if (distance > 0) {
                labelPosition = 'right'
                x1 += 0.66 * scaling.wordWidth
            } else {
                labelPosition = 'left'
                x1 += 0.33 * scaling.wordWidth
            }
            //Add label
            if (word.relation) {
                const labelStyle = {
                    top: `${y}px`,
                    left: `${x1}px`,
                }
                relationLabels .push(<span className={`arc__relation-label arc__relation-label--${labelPosition}`} style={labelStyle}>{treebank.settings.relations[word.relation]}</span>)
            }
            //Calculate curve contorl point
            const cX = x1 + (0.5 * distance * scaling.wordWidth)
            let cY = Math.max(depth - Math.abs(distance), - depth/2) * yUnit
            return <path d={`M${x1} ${y} Q${cX} ${cY} ${x2} ${y}`} key={word.id} strokeWidth="2" stroke="#758AA8" opacity="0.6" fill="transparent" markerStart="url(#arrow)" />
        })

        const words = sentence.words.map( word => {
            const editable = word.index == current.word ? true : false
            const x = (word.index-1) * scaling.units.x
            return <Word word={word}
                x={x} y={y}
                scaling={scaling}
                editWord={editWord}
                deleteWord={deleteWord}
                actions={actions}
                current={current}
                editable={editable}
                key={word.id}
            />
        })

        return (
            <div className="arc" onClick={deselect} ref={element => this.element = element}>
                <div className="arc__magnifier" style={{transform: `scale(${zoom})`}}>
                    <svg className="arc__arrows">
                        <defs>
                            <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto-start-reverse">
                              <path d="M0,0 L0,6 L7,3 z" fill="#758AA8" />
                            </marker>
                        </defs>
                        {arrows}
                    </svg>
                    {words}
                    <div className="arc__relation-labels">
                        {relationLabels}
                    </div>
                </div>
            </div>
        )
    }

}

export default Arrows;
