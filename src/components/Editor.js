import React, { Component } from 'react'
import { withRouter, Route } from 'react-router-dom';
import Sidebar from './Sidebar'
import Tree from './Tree'

const Editor = props => {

  const { match, actions } = props
  const sentences = props.sentences || []

  actions.fetchSentences(match.params.treebank)

  return (
    <div>
      <Sidebar sentences={sentences} />
      <Route path="/edit/:treebank/:sentence" render={
        (props) => {
          let sentence = sentences[props.match.params.sentence] || null
          return <Tree {...props} actions={actions} sentence={sentence} />
        }
      } />
    </div>
  )

}

export default withRouter(Editor)
