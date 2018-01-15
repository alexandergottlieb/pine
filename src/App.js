import React, { Component } from 'react';
import './App.css';
import Editor from './components/Editor.js'

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
      <div className="App">
        <Editor sentence={sentence} />
      </div>
    );
  }
}

export default App;
