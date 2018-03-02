import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import * as actionCreators from "./actions";
import Edit from './components/Edit'
import Home from './components/Home'
import Login from './components/Login'

class App extends Component {

  componentDidMount() {
    const { user, actions } = this.props
    actions.syncAuth()
  }

  componentWillReceiveProps(nextProps) {
    const { user, actions } = nextProps
    if (user.loggedIn) actions.syncTreebanks()
  }

  render() {
    const { user, actions, current, treebanks, sentences } = this.props

    if (user.loggedIn) {
      return (
        <BrowserRouter>
          <div className="app">
            <Route path="/" exact render={(props) => <Home {...props} actions={actions} treebanks={treebanks} sentences={sentences} current={current} user={user} />} />
            <Route path="/edit/:treebank/:sentence?/:page?" render={(props) => <Edit {...props} actions={actions} current={current} sentences={sentences} treebanks={treebanks} />} />
          </div>
        </BrowserRouter>
      )
    } else {
      return <Login current={current} actions={actions} />
    }
  }
}

const mapStateToProps = (state) => ({...state});

const mapDispatchToProps = (dispatch) => ({
	//shorthand for actionCreator: (param) => { dispatch(actionCreator(param)) } for each creator
	actions: bindActionCreators(actionCreators, dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
