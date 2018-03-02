import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import '../css/Sidebar.css'

const Sidebar = props => {

  const { current, sentences, treebanks } = props

  const treebank = treebanks[current.treebank] || {name: "", sentences: ""}

  const sentenceLinks = sentences.map( sentence => {
    const { id } = sentence
    const cls = current.sentence !== null && current.sentence === id ? "sentences__sentence sentences__sentence--active" : "sentences__sentence"
    return <Link key={id} className={cls} to={`/edit/${current.treebank}/${id}`} title={sentence.sentence}>{sentence.sentence}</Link>
  })

  return (
    <div className="sidebar">
      <header className="sidebar__header">
        <nav className="breadcrumbs">
          <Link className="breadcrumbs__breadcrumb" to="/">Treebanks</Link>
          <span className="breadcrumbs__breadcrumb breadcrumbs__breadcrumb--current"> / Edit</span>
        </nav>
        <h1 className="sidebar__title">{treebank.name}</h1>
      </header>
      <nav className="sentences">
        {sentenceLinks}
      </nav>
      <footer className="sidebar__footer">
        <div className="sidebar__create-sentence">
          <Button type="primary" icon="fa-plus-circle">New Sentence</Button>
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

export default Sidebar
