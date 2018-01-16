import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import './App.css';
import Editor from './components/Editor.js'
import Sidebar from './components/Sidebar.js'

class App extends Component {
  render() {
    let sentence = {
      3: {
        "parent": 0, //root
        "word": "had"
      },
      2: {
        "parent": 3,
        "word": "news"
      },
      1: {
        "parent": 2,
        "word": "economic"
      },
      5: {
        "parent": 3,
        "word": "effect"
      },
      4: {
        "parent": 5,
        "word": "little"
      },
      6: {
        "parent": 5,
        "word": "on"
      },
      7: {
        "parent": 8,
        "word": "financial"
      },
      8: {
        "parent": 6,
        "word": "markets"
      }
    };

    return (
      <BrowserRouter>
        <div className="app">
          <Route path="/edit">
            <div class="route--edit">
              <Sidebar />
              <Editor sentence={sentence} />
            </div>
          </Route>
          <Route path="/">
            <div class="route--home">

            </div>
          </Route>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
