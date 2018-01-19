import React from 'react';
import { Link } from 'react-router-dom';

const Treebank = props => {

    const {treebank} = props
    const {id, name} = treebank

    return (
        <div>
            <Link to={`/edit/${id}`}><h3>{name}</h3></Link>
            <small>{treebank.sentences} sentences</small>
            <button onClick={() => props.delete(id)}>Delete</button>
        </div>
    )

}

export default Treebank;
