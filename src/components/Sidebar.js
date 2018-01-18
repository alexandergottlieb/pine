import React, { Component } from 'react'

class Sidebar extends Component {

  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    return (
      <div className="sidebar">

        <h1>Treebank Name</h1>
        <input className="search" type="text" />
        <div>

        </div>
        <button type="button">Download</button>
        <button type="button">New Sentence</button>
      </div>
    )
  }
}

export default Sidebar
