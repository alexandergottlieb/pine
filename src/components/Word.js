import React from 'react';
import '../css/Word.css'

const Word = props => {

    const { index, word, x, y, scaling, relations, editable, actions} = props
    const { setWord } = actions

    const realX = x * scaling.units.x
    const realY = y * scaling.units.y

    const style = {
        top: realY+'px',
        left: realX+'px',
        width: scaling.wordWidth+'px',
    }

    const editableClass = editable ? ' word--editable' : ''

    const cls = `word word--${word.uposTag.toLowerCase()}${editableClass}`

    const mouseUp = event => {
        if (relations && relations.length > 0) {
            //TODO - action to edit relation between words
        } else {
            if (!editable) setWord(index)
        }
        event.stopPropagation()
    }

    return (
        <div className={cls} style={style} onMouseUp={mouseUp}>
            <span className="word__inflection" contentEditable={editable ? "true" : "false"} suppressContentEditableWarning>{word.inflection}</span>
            <span className="word__pos-tag">{word.uposTag.toUpperCase()}</span>
            <div className="word__data">

            </div>
        </div>
    )

}

export default Word;
