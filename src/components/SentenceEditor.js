import React, { Component } from 'react'
import {SortableContainer, SortableElement, arrayMove} from 'react-sortable-hoc';
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
    const { sentence } = this.props
    if (sentence) {
      return <Sentence words={this.state.words} sentenceIndex={sentence.index} onSortEnd={this.onSortEnd} axis="x" />
    } else {
      return null
    }
  }

}

const Sentence = SortableContainer( ({ words, sentenceIndex }) => {
  return (
    <ul className="sentence-editor">
      {words.map( (word, index) => (
        <Word key={`${sentenceIndex}_${index}`} index={Number(index)} word={word} />
      ))}
    </ul>
  )
})


const Word = SortableElement( ({word}) => {
    const { inflection, uposTag } = word
    const classes = ["sentence-editor__word"]
    if (uposTag) classes.push(`sentence-editor__word--${uposTag.toLowerCase()}`)
    return <li className={classes.join(" ")}>{inflection}</li>
})
