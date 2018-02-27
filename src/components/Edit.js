import React, { Component } from 'react'
import { BrowserRouter, Route } from 'react-router-dom';
import Sidebar from './Sidebar'
import Editor from './Editor'
import '../css/Editor.css'

export default class Edit extends Component {

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

    const { actions, current, sentences, treebanks } = this.props

    return (
      <div>
        <Sidebar current={current} sentences={sentences} treebanks={treebanks} />
        <Route path='/edit/:treebank/:sentence' exact render={(props) => <Editor {...props} actions={actions} current={current} sentences={sentences} treebanks={treebanks} />} />
        <Route path='/edit/:treebank/:sentence/settings' component={null} />
      </div>
    )
  }

}
