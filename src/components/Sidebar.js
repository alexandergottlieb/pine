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
      <nav className="breadcrumbs">
        <Link to="/">Treebanks</Link> <span className="breadcrumbs__breadcrumb breadcrumbs__breadcrumb--current">/ Edit</span>
      </nav>
      <h1 className="sidebar__title">{treebank.name}</h1>
      <nav className="sentences">
        {sentenceLinks}
      </nav>
      <div className="sidebar__buttons">
        <div className="sidebar__create-sentence">
          <Button type="primary" icon="fa-plus-circle">New Sentence</Button>
        </div>
        <Button type="secondary" icon="fa-question-circle" link={`/edit/${current.treebank}/${current.sentence}/help`}>Help</Button>
        <Button type="secondary" icon="fa-cog" link={`/edit/${current.treebank}/${current.sentence}/settings`}>Settings</Button>
      </div>
    </div>
  )

}

export default Sidebar
