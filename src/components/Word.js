import React from 'react';

const Word = props => {

    const { index, word, x, y, xUnit, yUnit, width, editable, actions} = props
    const { setWord } = actions

    const realX = x * xUnit
    const realY = y * yUnit

    const style = {
        top: realY+'px',
        left: realX+'px',
        width: width+'px',
    }

    const editableClass = editable ? ' word--edit' : ''

    const cls = `word word--${word.uposTag.toLowerCase()}${editableClass}`

    const handleClick = event => {
        if (editable) { //Toggle
            setWord()
        } else {
            setWord(index)
        }
    }

    return (
        <div className={cls} style={style}>
            <span className="word__inflection" contentEditable={editable ? "true" : "false"}>{word.inflection}</span>
            <span className="word__pos-tag">{word.uposTag.toUpperCase()}</span>
            <span className="word__edit fa fa-pencil" onClick={handleClick}></span>
            <div className="word__data">

            </div>
        </div>
    )

}

export default Word;
