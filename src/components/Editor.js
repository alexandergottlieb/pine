import React, { Component } from 'react'
import debounce from 'debounce'
import Sentence from '../classes/Sentence'
import Word from '../classes/Word'
import Tree from './Tree'
import Messages from './Messages'
import Button from './Button'
import SentenceEditor from './SentenceEditor'

export default class Editor extends Component {

  constructor(props) {
    super(props)
    this.state = {
      zoom: 1.0,
      recentlyZoomed: false
    }
  }

  moveWord = (moved, oldIndex, newIndex) => {
    const { actions, current, sentence } = this.props

    //Update indices in sentence, starting from 1
    let words = moved.map( (word, newPosition) => {
      word.index = newPosition + 1
      return word
    })
    //Update parents
    words = words.map( word => {
      if (word.parent !== 0) { //If not root
        const parentID = sentence.wordByIndex(word.parent).id
        word.parent = words.find(otherWord => otherWord.id === parentID).index
      }
      return word
    })
    //Update words
    actions.editWords(current.treebank, current.sentence, words)
    //Update sentence.sentence
    let editedSentence = new Sentence({words})
    editedSentence.stringSentenceTogether()
    actions.editSentence(current.treebank, current.sentence, {
      sentence: editedSentence.sentence
    })
  }

  createWord = (data) => {
    const { actions, current, sentence } = this.props

    let word = new Word()
    //Either parent is the root descendent or artificial root
    const rootDescendent = sentence.words.find(word => word.parent === 0)
    const parent = rootDescendent ? rootDescendent.index : 0
    let index = sentence.wordCount() + 1 //index starts at 1
    const newWord = { ...word, ...data, index, parent }
    actions.createWord(current.treebank, current.sentence, newWord)

    //Update sentence.sentence
    let newWords = sentence.words.map(word => word)
    newWords.push(newWord)
    let editedSentence = new Sentence({words: newWords})
    editedSentence.stringSentenceTogether()
    actions.editSentence(current.treebank, current.sentence, {
      sentence: editedSentence.sentence
    })
  }

  editWord = (wordIndex, data) => {
    const { sentence, current, actions, treebank } = this.props

    const editedSentence = new Sentence(sentence)

    //If assigning new root, set current root to descend from the new
    const oldRoot = (data.hasOwnProperty("parent") && data.parent === 0) ? editedSentence.rootWord() : null
    if (oldRoot) oldRoot.parent = wordIndex

    Object.assign(editedSentence.wordByIndex(wordIndex), data)

    //Validate sentence & update
    try {
      editedSentence.validate()
      const wordID = sentence.wordByIndex(wordIndex).id
      if (oldRoot) {
        //Edit old root & word
        actions.editWords(current.treebank, current.sentence, editedSentence.words)
      } else {
        //Edit word
        actions.editWord(current.treebank, current.sentence, wordID, data)
      }
      //Re-string sentence together
      editedSentence.stringSentenceTogether()
      actions.editSentence(current.treebank, current.sentence, {
        sentence: editedSentence.sentence
      })
    } catch (errorMessage) {
      if (typeof errorMessage === "string") {
        actions.addError(errorMessage)
      } else { //Unexpected error
        throw errorMessage
      }
    }
  }

  deleteWord = (word) => {
    const { actions, current, sentence } = this.props

    let editedSentence = new Sentence(sentence)

    //Remove word
    editedSentence.words = editedSentence.words.filter(aWord => aWord.id !== word.id)
    //Change order & relations
    let newParent = word.parent > word.index ? word.parent - 1 : word.parent
    editedSentence.words = editedSentence.words.map(aWord => {
      //Shift indices of all words after the deleted word down 1
      if (aWord.index > word.index) aWord.index--
      if (aWord.parent > word.index) aWord.parent--
      if (aWord.parent === word.index) {
        //Only one word can descend from root, so attach to sibling if multiple words
        if (newParent === 0) {
          newParent = aWord.index
          aWord.parent = 0
        } else {
          aWord.parent = newParent
        }
      }
      return aWord
    })
    //Update words
    actions.editWords(current.treebank, current.sentence, editedSentence.words)
    //Update sentence text
    editedSentence.stringSentenceTogether()
    actions.editSentence(current.treebank, current.sentence, {
      sentence: editedSentence.sentence
    })
  }

  //Deselect when user clicks outside subelements
  deselect = () => {
    const { actions, current } = this.props
    if (current.relations) actions.clearRelations()
    if (current.word) actions.setWord()
  }

  zoomIn = () => {
    //Max 300%
    let newZoom = this.state.zoom + 0.25
    if (newZoom > 2) newZoom = 2
    this.setState({
      zoom: newZoom,
      recentlyZoomed: true
    })
    this.clearZoom()
  }

  zoomOut = () => {
    //Min 10%
    let newZoom = this.state.zoom - 0.25
    if (newZoom < 0.25) newZoom = 0.25
    this.setState({
      zoom: newZoom,
      recentlyZoomed: true
    })
    this.clearZoom()
  }

  clearZoom = debounce(() => {
    this.setState({
      recentlyZoomed: false
    })
  }, 600)

  render() {
    const { actions, current, sentence, treebank } = this.props

    let contents = null
    if (sentence && sentence.words.length > 0) {
      contents = <div>
        <Tree sentence={sentence}  treebank={treebank} zoom={this.state.zoom} editWord={this.editWord} deleteWord={this.deleteWord} deselect={this.deselect} current={current} actions={actions} />
        <div className="editor__toolbar">
          <small className={`editor__zoom editor__zoom--${this.state.recentlyZoomed ? "show" : "hide"}`}>{Math.round(this.state.zoom * 100, 0)+"%"}</small>
          <Button className="editor__toolbar-button" onClick={this.zoomOut} icon="fa-minus" type="circle" />
          <Button className="editor__toolbar-button" onClick={this.zoomIn} icon="fa-plus" type="circle" />
        </div>
      </div>
    } else {
      contents = (
        <div className="editor__default">
          <span className="fas fa-hand-point-left fa-5x"></span>
          <p>Select a sentence to edit</p>
        </div>
      )
    }

    return (
      <div className="editor">
        <SentenceEditor sentence={sentence} currentWord={current.word} moveWord={this.moveWord.bind(this)} createWord={this.createWord.bind(this)} />
        {contents}
        <Messages messages={current.messages} />
      </div>
    )
  }

}
