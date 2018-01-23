import React from 'react';

const Word = props => {

    const {word, x, y, xUnit, yUnit, width} = props;

    const realX = x * xUnit;
    const realY = y * yUnit;

    const style = {
        position: "absolute",
        top: realY+'px',
        left: realX+'px',
        width: width+'px',
        padding: '0.5em 0',
        textAlign: 'center',
        background: '#f3f3f3',
        color: '#333',
        borderRadius: '5px'
    }

    return (
        <span className="tree__word" style={style}>{word.inflection}<small>{x}</small></span>
    )

}

export default Word;
