import React from 'react';
import '../css/Relation.css'

const Relation = props => {

    const { coords, word, actions} = props

    const dX = coords.x2 - coords.x1
    const dY = coords.y2 - coords.y1

    const labelStyle = {
        left: coords.x1 + dX*0.66 + 'px',
        top: coords.y1 + dY*0.66 + 'px'
    }

    const grabStyle = {
        left: coords.x1 + dX*0.4 + 'px',
        top: coords.y1 + dY*0.4 + 'px'
    }

    const down = event => {
        actions.setRelation(word.index)
    }

    const up = event => {
        actions.setRelation()
    }

    return (
        <div className="relation">
            <span className="relation__label" style={labelStyle}>{word.relation}</span>
            <button className="relation__grab" onMouseDown={down} onMouseUp={up} style={grabStyle}></button>
        </div>
    )

}

export default Relation;
