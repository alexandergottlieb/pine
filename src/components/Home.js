import React, { Component } from 'react'
import Treebank from '../classes/Treebank'
import TreebankComponent from './Treebank'
import Messages from './Messages'
import Header from './Header'
import Version from "./Version"
import '../css/Home.css'

class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {}
  }

  addFile(file) {
    const { actions, user } = this.props
    if (!file) return
    let treebank = new Treebank()
    treebank.name = file.name.slice(0,-7) //filename without .conllu extension

    let reader = new FileReader()
    reader.onload = event => {
      let text = event.target.result
      try {
        treebank.parseFile(text)
        if (treebank.multitokens) actions.addMessage(`Multitokens in '${treebank.name}' have been split.`)
        actions.uploadTreebank(treebank, user)
      } catch (e) {
        console.error(e)
        actions.addError(`Could not upload '${treebank.name}'. ${e.message}`, false)
      }
    }

    reader.readAsText(file)
  }

  render() {
    const { treebanks, actions, current, user } = this.props

    const treebanksList = []
    for (let id in this.props.treebanks) {
      let treebank = this.props.treebanks[id]
      const exporting = current.exports.downloading.indexOf(id) !== -1
      treebanksList.push(<TreebankComponent treebank={treebank} key={treebank.id} actions={actions} exporting={exporting} />)
    }

    return (
      <div className="home">
        <Header current={current} user={user} actions={actions} />
        <main className="home__main">
          <h2>Treebanks</h2>
          <Messages messages={current.messages} />
          <div className="treebanks">
            {treebanksList}
          </div>
          <div style={{textAlign:"center", marginTop:"2rem"}}>
            <p>
            <label className="upload-treebank" title="Add a treebank in .conllu format">
              <span className="fas fa-cloud-upload-alt"></span> Upload
              <input type="file" onChange={(event) => this.addFile(event.target.files[0])} accept=".conllu" />
            </label>
            </p>
            <p><small>Add a new treebank in .conllu format</small></p>
          </div>
          <Version />
        </main>
      </div>
    )
  }
}

export default Home
