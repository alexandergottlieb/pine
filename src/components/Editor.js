import React, { Component } from 'react'
import Sentence from '../classes/Sentence'
import Word from '../classes/Word'
import Sidebar from './Sidebar'
import Tree from './Tree'
import Messages from './Messages'
import SentenceEditor from './SentenceEditor'
import '../css/Editor.css'

class Editor extends Component {

  componentDidMount() {
    this.syncURLToState()
  }

  componentDidUpdate() {
    this.syncURLToState()
  }

  syncURLToState() {
    //Sync react router params with redux current state
    const { match, actions, current } = this.props

    //Maybe update current from URL
    const treebankID = match.params.treebank || null
    const sentenceID = match.params.sentence || null

    if ( current.treebank !== treebankID
      || current.sentence !== sentenceID
    ) {
      actions.setCurrent(treebankID, sentenceID)
      actions.setWord()
      actions.clearRelations()
      return null
    }
  }

  moveWord(moved, oldIndex, newIndex) {
    const { actions, current, sentences } = this.props
    const sentence = sentences.find(sentence => sentence.id === current.sentence)
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

  createWord(data) {
    const { actions, current, sentences } = this.props
    const sentence = sentences.find(sentence => sentence.id === current.sentence)

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

  render() {
    const { actions, current, sentences, treebanks } = this.props

    let contents = null
    let sentence = sentences.find(sentence => sentence.id === current.sentence)
    if (sentence !== undefined) {
      contents = sentence.words.length > 0
        ? <Tree actions={actions} sentence={sentence} current={current} />
        : null
    } else {
      contents = (
        <div className="editor__default">
          <span className="fa fa-hand-point-left fa-5x"></span>
          <p>Select a sentence to edit</p>
        </div>
      )
    }

    return (
      <div>
        <Sidebar current={current} sentences={sentences} treebanks={treebanks} />
        <div className="editor">
          <SentenceEditor sentence={sentence} moveWord={this.moveWord.bind(this)} createWord={this.createWord.bind(this)} />
          {contents}
          <Messages messages={current.messages} />
        </div>
      </div>
    )
  }

}

export default Editor
