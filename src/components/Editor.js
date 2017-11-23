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
      },
      9: {
        "parent": 5,
        "word": "another"
      }
    };
    let tree = new Tree(sentence);
    tree.positionNodes();
    console.log(tree);
    const context = this.canvas.getContext('2d');
    context.font = "16px system-ui";
    tree.breadthFirst(node => {context.fillText(node.word, node.x * 300 + 100, node.y * 50 + 100)});
  }

  render() {
    return (
      <canvas id="tree" ref={(canvas) => {this.canvas = canvas}} width="1920" height="1080"></canvas>
    );
  }
}

export default Editor;
