import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actionCreators from "./actions";
import Editor from './components/Editor'
import Home from './components/Home'
import './App.css';

const App = (props) => {

  return (
    <BrowserRouter>
      <div className="app">
        <Route path="/" component={Home} />
        <Route path="/edit" render={() => <Editor treebank={props.treebank} />} />
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
