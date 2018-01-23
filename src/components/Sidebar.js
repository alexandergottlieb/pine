import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const Sidebar = props => {

  let { current } = props
  let { sentences } = current

  sentences = sentences.map( (sentence, id) => {
    const cls = Number(current.sentence) === id ? "sentences__sentence sentences__sentence--active" : "sentences__sentence"
    return <li key={id} className={cls}><Link to={`/edit/${current.treebank}/${id}`}>{sentence.sentence}</Link></li>
  })

  return (
    <div className="sidebar">
      <p className="breadcrumbs"><Link to="/">Treebanks</Link></p>
      <ul className="sentences">
          {sentences}
      </ul>
      <button type="button">Download</button>
      <button type="button">New Sentence</button>
    </div>
  )

}

export default Sidebar
