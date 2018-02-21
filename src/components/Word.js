import React, { Component } from 'react'
import '../css/Word.css'

export default class Word extends Component {

    constructor(props) {
        super(props)
        const { word } = props
        const { inflection } = word
        this.state = {
            inflection
        }
        this.elements = {inflection: null}
    }

    render() {
        const { index, word, x, y, scaling, current, editable, editWord, actions} = this.props

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
                    editWord(childIndex, {
                        parent: index
                    })
                })
                actions.clearRelations()
            } else {
                if (!editable) {
                    actions.setWord(index)
                    this.elements.inflection.focus()
                }
            }
            event.stopPropagation()
        }

        const inflectionChange = event => {
            const { value } = event.target
            this.setState({
                inflection: value
            })
            this.props.editWord(word.index, {inflection: value})
        }

        return (
            <div className={cls} style={style} onClick={click}>
                <input className="word__inflection" onChange={inflectionChange.bind(this)} value={this.state.inflection} ref={el => this.elements.inflection = el}/>
                <span className="word__pos-tag">{word.uposTag.toUpperCase()}</span>
                <div className={`word__data word__data--${editable ? "show" : "hide"}`}>
                    <label>Lemma</label>
                    <input />
                    <label>UPOS</label>
                    <input />
                    <label>XPOS</label>
                    <input />
                </div>
            </div>
        )
    }

}
