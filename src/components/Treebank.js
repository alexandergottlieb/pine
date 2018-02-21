import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'
import '../css/Treebank.css'

const Treebank = props => {

    const { treebank, actions } = props
    const {id, name} = treebank

    return (
        <div className="treebank" to={`/edit/${id}`}>
            <Link to={`/edit/${id}`}><h3>{name}</h3></Link>
            <p>
                <small>{treebank.sentences} sentences</small>
            </p>
            <Button type="warning" onClick={() => actions.deleteTreebank(id)} icon="fa-trash"></Button>
            <Link to={`/edit/${id}`}><Button type="secondary" icon="fa-pencil">Open</Button></Link>
        </div>
    )

}

export default Treebank;
