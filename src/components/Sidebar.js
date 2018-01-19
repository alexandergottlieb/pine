import React, { Component } from 'react'

const Sidebar = props => {

  let { sentences } = props
  console.log(sentences)
  sentences.map(sentence => <li>{sentence.sentence}</li>)
  return (
    <div className="sidebar">

      <h1>Treebank Name</h1>
      <input className="search" type="text" />
      <ul>
          {sentences}
      </ul>
      <button type="button">Download</button>
      <button type="button">New Sentence</button>
    </div>
  )

}

export default Sidebar
