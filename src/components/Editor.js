import React, { Component } from 'react'
import Sidebar from './Sidebar'
import Tree from './Tree'
import Messages from './Messages'
import Sentence from '../classes/Sentence'
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

  render() {
    const { actions, current, sentences, words } = this.props

    //Get only sentences from current treebank
    const treebankSentences = sentences[current.treebank] || []

    let contents = null
    let sentence = null
    if (treebankSentences && current.sentence !== null) {
      sentence = Object.assign({}, treebankSentences[current.sentence])
      sentence.words = words || []
      contents = <Tree actions={actions} sentence={sentence} current={current} />
    } else {
      contents = (
        <div className="editor__no-selection">
          <span className="fa fa-hand-point-left fa-5x"></span>
          <p>Select a sentence to edit</p>
        </div>
      )
    }

    return (
      <div>
        <Sidebar current={current} sentences={treebankSentences} />
        <div className="editor">
          <h2 className="current-sentence">{sentence ? sentence.sentence : ''}</h2>
          {contents}
        </div>
        <Messages messages={current.messages} />
      </div>
    )
  }

}

export default Editor
