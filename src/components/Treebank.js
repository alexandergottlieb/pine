import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import '../css/Treebank.css'

const Treebank = props => {

    const { treebank, actions } = props
    const {id, name} = treebank

    return (
        <aside className="treebank">
            <Link to={`/edit/${id}`}><h1>{name}</h1></Link>
            <p>
                <small>{treebank.sentences} sentences</small>
            </p>
            <Button type="warning" onClick={() => actions.deleteTreebank(id)} icon="fa-trash">Delete</Button>
            <Button type="secondary" icon="fa-download" onClick={() => actions.queueExportTreebank(id)}>Export</Button>
            <Button type="primary" icon="fa-pencil-alt" link={`/edit/${id}`}>Edit</Button>
        </aside>
    )

}

export default Treebank;
