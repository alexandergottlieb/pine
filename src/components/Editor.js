import React, { Component } from 'react';
import Tree from '../classes/Tree';
import Word from './Word';

class Editor extends Component {

  constructor() {
    super()

    this.state = {
      words: []
    }
  }

  componentDidMount() {
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

    //Scaling factors
    const yUnit = 6;
    let longestWord = 0;
    for (let index in sentence) {
      if (sentence[index].word.length > longestWord) longestWord = sentence[index].word.length;
    }
    const xUnit = longestWord * 2 + 8; //relative to the longest word

    let tree = new Tree(sentence);
    tree.positionNodes();
    let words = [];
    tree.breadthFirst(node => { words.push(node) });
    console.log(words);
    words = words.map(word => { return <Word {...word} xUnit={xUnit} yUnit={yUnit} width={longestWord} key={word.index} /> });
    this.setState({words})
  }

  render() {
    return (
      <div id="editor">
        <div id="tree">{this.state.words}</div>
      </div>
    );
  }
}

export default Editor;
