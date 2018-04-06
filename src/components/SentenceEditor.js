import React, { Component } from 'react'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
import Button from "./Button"
import '../css/SentenceEditor.css'

export default class SentenceEditor extends Component {

  state = {
    words: []
  }

  constructor(props) {
    super(props)
    const { sentence } = props
    if (sentence) this.state = { words: sentence.words }
  }

  componentWillReceiveProps(newProps) {
    const { sentence } = newProps
    if (sentence) this.setState({ words: sentence.words })
  }

  onSortEnd = ({oldIndex, newIndex}) => {
    let newWords = this.state.words.map(word => {
      return {...word}
    })
    newWords = arrayMove(newWords, oldIndex, newIndex)
    this.setState({
      words: newWords
    })
    this.props.moveWord(newWords, oldIndex, newIndex)
  }

  render() {
    const { sentence, createWord, currentWord } = this.props
    if (!sentence) return null
    return (
      <div className="sentence-editor">
        <Sentence words={this.state.words} sentenceID={sentence.id} currentWord={currentWord} onSortEnd={this.onSortEnd} axis="x" />
        <CreateWord onCreate={createWord} />
      </div>
    )
  }

}

const Sentence = SortableContainer( ({ words, sentenceID, currentWord }) => {
  return (
    <ul className="sentence-editor__sentence">
      {words.map( (word, index) => {
        return <Word key={`${sentenceID}_${index}`} index={index} word={word} highlight={word.index === currentWord} />
      })}
    </ul>
  )
})


const Word = SortableElement( ({word, highlight}) => {
    const { inflection, uposTag } = word
    const classes = ["sentence-editor__word"]
    if (uposTag) classes.push(`sentence-editor__word--${uposTag.toLowerCase()}`)
    if (highlight) classes.push("sentence-editor__word--highlight")
    return <li className={classes.join(" ")}>{inflection}</li>
})

class CreateWord extends Component {

  constructor(props) {
    super(props)
    this.state = {
      expanded: false,
      input: ""
    }
  }

  buttonClick() {
    //Toggle expansion
    const expanded = this.state.expanded ? false : true
    this.setState({
      expanded: expanded,
      input: ""
    })
    this.input.focus()
  }

  inputChange(event) {
    this.setState({
      input: event.target.value.replace(/[\s]+/, '')
    })
  }

  keyUp(event) {
    if (event.keyCode === 13) {
      this.props.onCreate({inflection: event.target.value.trim()})
      this.setState({
        expanded: false,
        input: ""
      })
    }
  }

  render() {
    const { expanded, input } = this.state

    let cls = "create-word"
    if (expanded) cls += " create-word--expanded"
    return (
      <div className={cls}>
        <input
          ref={e => this.input = e}
          className="create-word__input sentence-editor__word"
          value={this.state.input}
          onChange={this.inputChange.bind(this)}
          onKeyUp={this.keyUp.bind(this)}
        />
        <Button className="create-word__button" icon="fa-plus-circle" onClick={this.buttonClick.bind(this)}></Button>
      </div>
    )
  }

}
