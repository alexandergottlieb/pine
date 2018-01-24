import React from 'react';

const Word = props => {

    const {word, x, y, xUnit, yUnit, width} = props;

    const realX = x * xUnit;
    const realY = y * yUnit;

    const style = {
        top: realY+'px',
        left: realX+'px',
        width: width+'px',
    }

    const cls = `word word--${word.uposTag.toLowerCase()}`

    return (
        <p className={cls} style={style}>
            <span className="word__inflection">{word.inflection}</span>
            <span className="word__pos-tag">{word.uposTag.toUpperCase()}</span>
            <span className="word__edit fa fa-pencil"></span>
        </p>
    )

}

export default Word;
