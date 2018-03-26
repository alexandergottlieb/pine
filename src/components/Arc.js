import React, { Component } from 'react';
import Word from './Word'
import Relation from './Relation'
import '../css/Arc.css'

class Arc extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { actions, current, treebank, editWord, deleteWord, deselect, zoom, scaling } = this.props
        const { nodes, origin } = this.state

        let words = []

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
