import React, { Component } from "react"
import Select from "react-select";
import Button from "./Button"
import "../css/Word.css"
import CONLLU from "../classes/CONLLU"

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

    componentWillReceiveProps(nextProps) {
        const {inflection, lemma, xposTag} = this.props.word

        //If word properties have changed, update state
        let newState = {}
        if (inflection !== nextProps.word.inflection) newState.inflection = nextProps.word.inflection
        if (lemma !== nextProps.word.lemma) newState.lemma = nextProps.word.lemma
        if (xposTag !== nextProps.word.xposTag) newState.xposTag = nextProps.word.xposTag
        this.setState(newState)
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

    deleteClicked = event => {
        const { deleteWord, word } = this.props
        event.stopPropagation();
        if (window.confirm(`Delete Word\n\n'${word.inflection}' will be removed from the sentence and annotation data will be lost.`)) deleteWord(word)
    }

    click = event => {
        const { current, actions, editWord, word, index, editable } = this.props
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
                actions.setWord(word.index)
                this.elements.inflection.focus()
            }
        }
        event.stopPropagation()
    }

    keyUp = event => {
        const { word, actions } = this.props
        if (event.keyCode === 13) {
            actions.setWord()
            event.target.blur()
        }
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

        const uposTags = CONLLU.uposTags()
        const uposTag = uposTags.find(tag => tag.value === word.uposTag)
        const uposTagValue = word.uposTag
            ? {
                value: word.uposTag,
                label: uposTag !== undefined ? uposTag.label : word.uposTag
            }
            : null

        let classes = ["word"]
        classes.push(`word--${word.uposTag.toLowerCase()}`)
        if (editable) classes.push("word--editable")
        if (current.relations && current.relations.length > 0) classes.push("word--relations-selected")

        return (
            <div className={classes.join(' ')} style={style} onClick={this.click.bind(this)} onKeyUp={this.keyUp.bind(this)}>
                <input className="word__inflection" onChange={this.inflectionChange.bind(this)} value={this.state.inflection} ref={el => this.elements.inflection = el} />
                <span className="word__pos-tag">{word.uposTag.toUpperCase()}</span>
                <div className={`word-data word-data--${editable ? "show" : "hide"}`}>
                    <label className="word-data__label" title="The root form of the word">Lemma</label>
                    <input className="word-data__input" onChange={this.lemmaChange.bind(this)} value={this.state.lemma} />

                    <label className="word-data__label" title="Part of speech tag in Universal Dependency notation">UPOS</label>
                    <Select value={uposTagValue} options={uposTags} onChange={this.uposChange.bind(this)} noResultsText="-" clearable={false} />

                    <label className="word-data__label" title="Language specific part of speech tag">XPOS</label>
                    <input className="word-data__input" onChange={this.xposChange.bind(this)} value={this.state.xposTag} />
                </div>
                <div className="word__delete" onClick={this.deleteClicked.bind(this)}>
                    <span className="fas fa-times"></span>
                </div>
            </div>
        )
    }

}
