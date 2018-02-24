import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import '../css/Sidebar.css'

const Sidebar = props => {

  const { current, sentences, treebanks } = props

  const treebank = treebanks[current.treebank] || {name: "", sentences: ""}

  const sentenceLinks = sentences.map( (sentence, id) => {
    const cls = current.sentence !== null && Number(current.sentence) === id ? "sentences__sentence sentences__sentence--active" : "sentences__sentence"
    return <Link key={id} className={cls} to={`/edit/${current.treebank}/${id}`} title={sentence.sentence}>{sentence.sentence}</Link>
  })

  return (
    <div className="sidebar">
      <nav className="breadcrumbs">
        <Link to="/">Treebanks /</Link> Edit
      </nav>
      <h1 className="sidebar__title">{treebank.name}</h1>
      <nav className="sentences">
          {sentenceLinks}
      </nav>
      <div className="sidebar__buttons">
        <Button type="primary" icon="fa-plus-circle" title="New Sentence">Add</Button>
      </div>
    </div>
  )

}

export default Sidebar
