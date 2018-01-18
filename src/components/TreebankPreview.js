import React from 'react';
import { Link } from 'react-router-dom';

const TreebankPreview = props => {

    const {id, treebank} = props

    return (
        <Link to={`/edit/${id}`}>
            <h3>{treebank.name}</h3>
            <small>{treebank.sentences.length} sentences</small>
        </Link>
    )

}

export default TreebankPreview;
