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
    const context = this.canvas.getContext('2d');
    context.font = "16px system-ui";
    tree.breadthFirst(node => {context.fillText(node.word, node.x * 128 + 128, node.y * 32 + 128)});
  }

  render() {
    return (
      <canvas id="tree" ref={(canvas) => {this.canvas = canvas}} width="1920" height="1080"></canvas>
    );
  }
}

export default Editor;
