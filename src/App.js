import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actionCreators from "./actions";
import Editor from './components/Editor'
import Home from './components/Home'

class App extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  componentDidUpdate() {
    const { actions, current, treebanks, sentences } = this.props
    //Do pending exports
    current.exports.ready.forEach(treebankID => {
      actions.exportTreebank(treebanks[treebankID], sentences[treebankID])
    })
  }

  render() {
    const { actions, current, treebanks, sentences } = this.props

    return (
      <BrowserRouter>
        <div className="app">
          <Route path="/" exact render={(props) => <Home {...props} actions={actions} treebanks={treebanks} sentences={sentences} current={current} />} />
          <Route path="/edit/:treebank/:sentence?" render={(props) => <Editor {...props} actions={actions} current={current} sentences={sentences} />} />
        </div>
      </BrowserRouter>
    )
  }
}

const mapStateToProps = (state) => ({...state});

const mapDispatchToProps = (dispatch) => ({
	//shorthand for actionCreator: (param) => { dispatch(actionCreator(param)) } for each creator
	actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
