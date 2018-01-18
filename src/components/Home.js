import React, { Component } from 'react'
import Treebank from '../classes/Treebank'
import { Link } from 'react-router-dom';

class Home extends Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  addFile(file) {
    let treebank = new Treebank()
    treebank.name = file.name

    let reader = new FileReader()
    reader.onload = event => {
      let text = event.target.result
      treebank.parseFile(text)
      this.props.setTreebank(treebank)
    }

    reader.readAsText(file)
  }

  render() {
    return (
      <div className="home">
        <h2>Private Treebanks</h2>
        <label>Add Treebank
          <input type="file" onChange={(event) => this.addFile(event.target.files[0])} accept=".conllu" />
          <Link to="/edit">Edit</Link>
        </label>
      </div>
    )
  }
}

export default Home
