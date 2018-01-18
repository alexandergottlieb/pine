import React, { Component } from 'react'
import Treebank from '../classes/Treebank'

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
      console.log(treebank)
      //TODO - upload
    }

    reader.readAsText(file)
  }

  render() {
    return (
      <div className="home">
        <h2>Private Treebanks</h2>
        <label>Add Treebank
          <input type="file" onChange={(event) => this.addFile(event.target.files[0])} accept=".conllu" />
        </label>
      </div>
    )
  }
}

export default Home
