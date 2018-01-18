import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actionCreators from "./actions";
import Editor from './components/Editor'
import Home from './components/Home'
import './App.css';

const App = (props) => {
  const {actions, treebank} = props

  return (
    <BrowserRouter>
      <div className="app">
        <Route path="/" exact render={() => <Home setTreebank={actions.setTreebank} />} />
        <Route path="/edit" render={() => <Editor treebank={treebank} sentence={sentence} />} />
      </div>
    </BrowserRouter>
  )

}

const mapStateToProps = (state) => ({
	use: state.user,
	treebank: state.treebank
});

const mapDispatchToProps = (dispatch) => ({
	//shorthand for actionCreator: (param) => { dispatch(actionCreator(param)) } for each creator
	actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
