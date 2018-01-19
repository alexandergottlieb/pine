import React, { Component } from 'react'
import CONLLU from '../classes/CONLLU'
import Treebank from './Treebank'

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {}

    this.props.actions.fetchTreebanks()
  }

  addFile(file) {
    if (!file) return
    let treebank = new CONLLU()
    treebank.name = file.name.slice(0,-7) //filename without .conllu extension

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
      treebanksList.push(<Treebank treebank={treebank} key={treebank.id} delete={this.props.actions.deleteTreebank} />)
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
