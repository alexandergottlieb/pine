import React, { Component } from 'react'
import Treebank from '../classes/Treebank'
import TreebankPreview from './TreebankPreview'

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {}

    this.props.actions.fetchTreebanks()
  }

  addFile(file) {
    let treebank = new Treebank()
    treebank.name = file.name

    let reader = new FileReader()
    reader.onload = event => {
      let text = event.target.result
      treebank.parseFile(text)
      this.props.actions.uploadTreebank(treebank)
    }

    reader.readAsText(file)
  }

  render() {
    const treebanksList = []
    for (let id in this.props.treebanks) {
      let treebank = this.props.treebanks[id]
      treebanksList.push(<TreebankPreview id={id} treebank={treebank} key={id} />)
    }

    return (
      <div className="home">
        <h2>Treebanks</h2>
        <label>Add Treebank
          <input type="file" onChange={(event) => this.addFile(event.target.files[0])} accept=".conllu" />
        </label>
        <div>
          {treebanksList}
        </div>
      </div>
    )
  }
}

export default Home
