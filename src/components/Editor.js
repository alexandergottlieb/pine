import React, { Component } from 'react'
import Sidebar from './Sidebar'
import Tree from './Tree'

const Editor = props => {

  const { match, actions, current } = props
  const { sentences } = current

  //Maybe update current from URL
  const treebankID = match.params.treebank || null
  const sentenceID = match.params.sentence || null

  if ( current.treebank !== treebankID
    || current.sentence !== sentenceID
  ) {
    actions.setCurrent(treebankID, sentenceID)
  }

  let tree = null
  if (current.sentence !== null) {
    const sentence = sentences[current.sentence]
    tree = <Tree actions={actions} sentence={sentence} />
  }

  return (
    <div>
      <Sidebar current={current} />
      {tree}
    </div>
  )

}

export default Editor
