import React, { Component } from 'react'
import Select from 'react-select';
import '../css/Word.css'
import CONLLU from '../classes/CONLLU'

export default class Word extends Component {

    constructor(props) {
        super(props)
        const { word } = props
        const { inflection, lemma, xposTag } = word
        this.state = {
            inflection, lemma, xposTag
        }
        this.elements = {inflection: null}
    }

    inflectionChange = event => {
        const { word, editWord } = this.props
        const { value } = event.target
        this.setState({
            inflection: value
        })
        editWord(word.index, {inflection: value})
    }

    uposChange = selected => {
        const { word, editWord } = this.props
        console.log('selected', selected)
        const { value } = selected
        if (value !== word.uposTag) editWord(word.index, {uposTag: value})
    }

    xposChange = event => {
        const { word, editWord } = this.props
        const { value } = event.target
        this.setState({
            xposTag: value
        })
        editWord(word.index, {xposTag: value})
    }

    lemmaChange = event => {
        const { word, editWord } = this.props
        const { value } = event.target
        this.setState({
            lemma: value
        })
        editWord(word.index, {lemma: value})
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

        const uposTags = CONLLU.uposTags()
        const uposTagValue = {
            value: word.uposTag,
            label: uposTags.find(tag => tag.value === word.uposTag).label
        }

        let classes = ["word"]
        classes.push(`word--${word.uposTag.toLowerCase()}`)
        if (editable) classes.push("word--editable")
        if (current.relations && current.relations.length > 0) classes.push("word--relations-selected")

        return (
            <div className={classes.join(' ')} style={style} onClick={click}>
                <input className="word__inflection" onChange={this.inflectionChange.bind(this)} value={this.state.inflection} disabled={editable ? "disabled" : "false"} ref={el => this.elements.inflection = el}/>
                <span className="word__pos-tag">{word.uposTag.toUpperCase()}</span>
                <div className={`word-data word-data--${editable ? "show" : "hide"}`}>
                    <label className="word-data__label" title="The root form of the word">Lemma</label>
                    <input className="word-data__input" onChange={this.lemmaChange.bind(this)} value={this.state.lemma} />

                    <label className="word-data__label" title="Part of speech tag in Universal Dependency notation">UPOS</label>
                    <Select value={uposTagValue} options={uposTags} onChange={this.uposChange.bind(this)} noResultsText="-" clearable={false} />

                    <label className="word-data__label" title="Language specific part of speech tag">XPOS</label>
                    <input className="word-data__input" onChange={this.xposChange.bind(this)} value={this.state.xposTag} />
                </div>
            </div>
        )
    }

}
