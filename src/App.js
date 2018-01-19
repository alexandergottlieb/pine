import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actionCreators from "./actions";
import Editor from './components/Editor'
import Home from './components/Home'
import './App.css';

const App = (props) => {
  const {actions, treebanks, sentences} = props

  return (
    <BrowserRouter>
      <div className="app">
        <Route path="/" exact render={(props) => <Home {...props} actions={actions} treebanks={treebanks} />} />
        <Route path="/edit/:treebank" render={(props) => <Editor {...props} actions={actions} sentences={sentences} />} />
      </div>
    </BrowserRouter>
  )

}

const mapStateToProps = (state) => ({
	user: state.user,
	treebanks: state.treebanks,
  meta: state.meta
});

const mapDispatchToProps = (dispatch) => ({
	//shorthand for actionCreator: (param) => { dispatch(actionCreator(param)) } for each creator
	actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
