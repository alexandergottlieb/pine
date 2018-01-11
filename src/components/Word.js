import React from 'react';

const Word = props => {

    const {word, x, y, xUnit, yUnit, width} = props;

    const realX = x * xUnit;
    const realY = y * yUnit;

    const style = {
        position: "absolute",
        top: realY+'em',
        left: realX+'em',
        width: width+'em',
        padding: '0.5em',
        textAlign: 'center',
        background: '#eee',
        borderRadius: '5px'
    }

    return (
        <span style={style}>{word}</span>
    )

}

export default Word;
