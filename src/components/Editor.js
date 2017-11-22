import React, { Component } from 'react';
import Tree from '../classes/Tree.js';

class Editor extends Component {

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
      }
    };
    let tree = new Tree(sentence);
    tree.positionNodes();
    console.log(tree);
  }

  render() {
    return (
      <canvas id="tree" ref={(canvas) => {this.canvas = canvas}}></canvas>
    );
  }
}

export default Editor;
