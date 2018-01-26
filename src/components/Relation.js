import React from 'react';

const Relation = props => {

    const { x, y, word, actions} = props

    const style = {
        left: x + 'px',
        top: y + 'px'
    }

    return (
        <div className="relation" style={style}>
            <span className="relation__name">{word.relation}</span>
        </div>
    )

}

export default Relation;
