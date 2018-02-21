import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

const Sidebar = props => {

  let { current, sentences } = props

  sentences = sentences.map( (sentence, id) => {
    const cls = current.sentence !== null && Number(current.sentence) === id ? "sentences__sentence sentences__sentence--active" : "sentences__sentence"
    return <Link key={id} className={cls} to={`/edit/${current.treebank}/${id}`}>{sentence.sentence}</Link>
  })

  return (
    <div className="sidebar">
      <nav className="breadcrumbs">
        <Link to="/">Treebanks</Link>
      </nav>
      <nav className="sentences">
          {sentences}
      </nav>
      <div class="sidebar__buttons">
        <Button>Download</Button>
        <Button primary>New Sentence</Button>
      </div>
    </div>
  )

}

export default Sidebar
