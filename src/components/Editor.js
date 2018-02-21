import React, { Component } from 'react'
import Sidebar from './Sidebar'
import Tree from './Tree'
import Messages from './Messages'
import '../css/Editor.css'

const Editor = props => {

  const { match, actions, current, sentences } = props

  //Maybe update current from URL
  const treebankID = match.params.treebank || null
  const sentenceID = match.params.sentence || null

  if ( current.treebank !== treebankID
    || current.sentence !== sentenceID
  ) {
    actions.setCurrent(treebankID, sentenceID)
  }

  let contents = null
  let sentence = null
  if (current.sentence !== null) {
    sentence = sentences[current.sentence]
    contents = <Tree actions={actions} sentence={sentence} current={current} />
  } else {
    contents = (
      <div className="editor__no-selection">
        <span className="fa fa-hand-o-left"></span>
        <p>Select a sentence to edit</p>
      </div>
    )
  }

  return (
    <div>
      <Sidebar current={current} sentences={sentences} />
      <div className="editor">
        <h2 className="current-sentence">{sentence ? sentence.sentence : ''}</h2>
        {contents}
      </div>
      <Messages messages={current.messages} />
    </div>
  )

}

export default Editor
