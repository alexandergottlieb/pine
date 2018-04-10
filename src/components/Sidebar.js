import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import debounce from "debounce"
import Sentence from '../classes/Sentence'
import Word from '../classes/Word'
import Button from './Button'
import '../css/Sidebar.css'

class Sidebar extends Component {

  constructor(props) {
    super(props)
    this.state = {
      treebankName: ""
    }
  }

  changeTreebankName = (event) => {
    const { value } = event.target
    this.setState({treebankName: value})
  }

  updateTreebankName = debounce(name => {
    const { actions, treebank } = this.props
    actions.editTreebank({...treebank, name})
  }, 300)

  componentWillReceiveProps(props) {
    const { treebank } = props
    this.setState({treebankName: treebank.name})
  }

  newSentenceClicked = () => {
    const { actions } = this.props
    const sentenceText = prompt("Type a new sentence")
    if (sentenceText) {
      let words = sentenceText.split(' ')
      let rootDescendent = null
      words = words.map((inflection, index) => {
        let word = new Word()
        word.inflection = inflection
        word.index = index+1
        if (rootDescendent === null) {
          rootDescendent = word
          word.parent = 0
        } else {
          word.parent = rootDescendent.index
        }
        return word
      })
      const sentence = new Sentence({words})
      actions.createSentence(sentence)
    }
  }

  render() {
    const { current, sentences, treebank, actions } = this.props

    const sentenceLinks = sentences.map( sentence => {
      const { id } = sentence
      const cls = current.sentence !== null && current.sentence === id ? "sentences__sentence sentences__sentence--active" : "sentences__sentence"
      const title = sentence.sentence.length > 0 ? sentence.sentence : "Empty Sentence"
      return <Link key={id} className={cls} to={`/edit/${current.treebank}/${id}`} title={title}>{title}</Link>
    })

    return (
      <div className="sidebar background-dark">
        <header className="sidebar__header">
          <nav className="breadcrumbs">
            <Link className="breadcrumbs__breadcrumb" to="/">Treebanks</Link>
            <span className="breadcrumbs__breadcrumb breadcrumbs__breadcrumb--current"> / Edit</span>
          </nav>
          <h1>
              <input className="sidebar__title"
                value={this.state.treebankName}
                onChange={this.changeTreebankName}
                onKeyUp={event => {if (event.keyCode === 13) this.updateTreebankName(event.target.value)}}
                type="text"
              />
          </h1>
        </header>
        <nav className="sentences">
          {sentenceLinks}
        </nav>
        <footer className="sidebar__footer">
          <div className="sidebar__create-sentence">
            <Button type="primary" icon="fa-plus-circle" onClick={this.newSentenceClicked}>New Sentence</Button>
          </div>
          <Button
            className={`sidebar__button ${current.page === "help" ? "sidebar__button--active" : ""}`}
            type="secondary"
            icon="fa-question-circle"
            link={`/edit/${current.treebank}/help`}
          >
            Help
          </Button>
          <Button
            className={`sidebar__button ${current.page === "settings" ? "sidebar__button--active" : ""}`}
            type="secondary"
            icon="fa-cog"
            link={`/edit/${current.treebank}/settings`}
          >
            Settings
          </Button>
        </footer>
      </div>
    )
  }

}

export default Sidebar
