import React from 'react'
import { Link } from 'react-router-dom'
import Button from './Button'

const Treebank = props => {

    const { treebank, exporting, actions } = props
    const {id, name} = treebank

    const exportButton = !exporting
        ? <Button className="treebank__export" type="secondary" icon="fa-download" onClick={() => actions.queueExportTreebank(id)}>Export</Button>
        : <Button className="treebank__export" type="secondary" icon="fa-cog fa-spin" disabled>Export</Button>

    return (
        <aside className="treebank">
            <Link to={`/edit/${id}`}><h1 className="treebank__name">{name}</h1></Link>
            <p>
                <small>{treebank.sentences} sentences</small>
            </p>
            <div class="treebank__buttons">
                {exportButton}
                <Button type="primary" icon="fa-pencil-alt" link={`/edit/${id}`}>Edit</Button>
            </div>
        </aside>
    )

}

export default Treebank;
