import React, { Component } from 'react';
import Word from './Word'
import Relation from './Relation'
import '../css/Arc.css'

class Arc extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { sentence, actions, current, treebank, editWord, deleteWord, deselect, zoom, scaling } = this.props

        let words = sentence.words.map( word => {
            const editable = word.index == current.word ? true : false
            return <Word word={word}
                x={word.index-1} y="0"
                scaling={scaling}
                editWord={editWord}
                deleteWord={deleteWord}
                actions={actions}
                current={current}
                editable={editable}
                key={word.id}
            />
        })

        //Scale and translate so that zoom aligns left
        const translateToLeft = - ( ( (1 - zoom) / 2 ) / zoom ) * 100
        const magnifierStyle = {transform: `scale(${zoom}) translateX(${translateToLeft}%)`}

        return (
            <div className="arc" onClick={deselect} ref={element => this.element = element}>
                <div className="arc__magnifier" style={magnifierStyle}>
                    <svg className="arc__arrows"></svg>
                    {words}
                </div>
            </div>
        )
    }

}

export default Arc;
