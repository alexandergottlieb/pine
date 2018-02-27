import React, { Component } from 'react'
import CONLLU from '../classes/CONLLU'
import Treebank from './Treebank'
import Messages from './Messages'
import '../css/Home.css'

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  addFile(file) {
    const { actions } = this.props
    if (!file) return
    let treebank = new CONLLU()
    treebank.name = file.name.slice(0,-7) //filename without .conllu extension

    let reader = new FileReader()
    reader.onload = event => {
      let text = event.target.result
      try {
        treebank.parseFile(text)
        if (treebank.multitokens) actions.addMessage(`Multitokens in '${treebank.name}' have been split.`)
        actions.uploadTreebank(treebank)
      } catch (e) {
        actions.addError(`Could not upload file: ${e.message}`)
      }
    }

    reader.readAsText(file)
  }

  render() {
    const { treebanks, actions, current } = this.props

    const treebanksList = []
    for (let id in this.props.treebanks) {
      let treebank = this.props.treebanks[id]
      const exporting = current.exports.downloading.indexOf(id) !== -1
      treebanksList.push(<Treebank treebank={treebank} key={treebank.id} actions={actions} exporting={exporting} />)
    }

    return (
      <div className="home">
        <h1>Treebanks</h1>
        <div className="treebanks">
          {treebanksList}
        </div>
        <label className="upload-treebank" title="Add a treebank in .conllu format">
          <span className="fas fa-cloud-upload-alt"></span> Upload
          <input type="file" onChange={(event) => this.addFile(event.target.files[0])} accept=".conllu" />
        </label>
        <Messages messages={current.messages} />
      </div>
    )
  }
}

export default Home
