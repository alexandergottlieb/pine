import React from 'react';
import '../css/Word.css'

const Word = props => {

    const { index, word, x, y, scaling, current, editable, actions} = props

    const realX = x * scaling.units.x
    const realY = y * scaling.units.y

    const style = {
        top: realY+'px',
        left: realX+'px',
        width: scaling.wordWidth+'px',
    }

    const editableClass = editable ? ' word--editable' : ''

    const cls = `word word--${word.uposTag.toLowerCase()}${editableClass}`

    const click = event => {
        if (current.relations && current.relations.length > 0) {
            //Set all relations to point to this word
            current.relations.forEach(childIndex => {
                actions.editWord(current.sentence, childIndex, {
                    parent: index
                })
            })
            actions.clearRelations()
        } else {
            if (!editable) actions.setWord(index)
        }
        event.stopPropagation()
    }

    return (
        <div className={cls} style={style} onClick={click}>
            <span className="word__inflection" contentEditable={editable ? "true" : "false"} suppressContentEditableWarning>{word.inflection}</span>
            <span className="word__pos-tag">{word.uposTag.toUpperCase()}</span>
            <div className="word__data">

            </div>
        </div>
    )

}

export default Word;
