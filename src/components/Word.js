import React from 'react';
import '../css/Word.css'

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

    const editableClass = editable ? ' word--editable' : ''

    const cls = `word word--${word.uposTag.toLowerCase()}${editableClass}`

    const handleClick = event => {
        if (!editable) setWord(index)
        event.stopPropagation()
    }

    return (
        <div className={cls} style={style} onClick={handleClick}>
            <span className="word__inflection" contentEditable={editable ? "true" : "false"} suppressContentEditableWarning>{word.inflection}</span>
            <span className="word__pos-tag">{word.uposTag.toUpperCase()}</span>
            <div className="word__data">

            </div>
        </div>
    )

}

export default Word;
