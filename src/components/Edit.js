import React, { Component } from 'react'
import { Route, Switch } from 'react-router-dom';
import Sidebar from './Sidebar'
import Editor from './Editor'
import Settings from './Settings'
import Help from './Help'
import NotFound from "./NotFound"
import '../css/Edit.css'

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
    const page = match.params.page || null

    if ( current.treebank !== treebankID
      || current.sentence !== sentenceID
      || current.page !== page
    ) {
      actions.setCurrent(treebankID, sentenceID, page)
      actions.setWord()
      actions.clearRelations()
    }
  }

  render() {

    const { actions, current, sentences, treebanks, user } = this.props
    const currentTreebank = treebanks[current.treebank]
    const currentSentence = sentences.find(sentence => sentence.id === current.sentence)

    if (!currentTreebank) return <NotFound />

    return (
      <div>
        <Sidebar current={current} sentences={sentences} treebank={currentTreebank} actions={actions} />
        <main className="main background-light">
          <Switch>
            <Route path="/edit/:treebank/help" exact component={Help} />
            <Route path="/edit/:treebank/settings" exact render={(props) => <Settings {...props} actions={actions} current={current} treebank={currentTreebank} />} />
            <Route path="/edit/:treebank/:sentence?" exact render={(props) => {
              return currentSentence
                ? <Editor {...props} actions={actions} current={current} sentence={currentSentence} treebank={currentTreebank} />
                : null
            }} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
    )
  }

}
