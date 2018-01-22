import React, { Component } from 'react'
import { Link } from 'react-router-dom'

const Sidebar = props => {

  let { current } = props
  let { sentences } = current

  sentences = sentences.map( (sentence, id) => <li key={id}><Link to={`/edit/${current.treebank}/${id}`}>{sentence.sentence}</Link></li> )

  return (
    <div className="sidebar">
      <p className="breadcrumbs"><Link to="/">Treebanks</Link> /</p>
      <h1>Treebank Name</h1>
      <ul>
          {sentences}
      </ul>
      <button type="button">Download</button>
      <button type="button">New Sentence</button>
    </div>
  )

}

export default Sidebar
