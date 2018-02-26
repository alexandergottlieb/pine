import React, { Component } from 'react';
import CONLLU from '../classes/CONLLU'
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import '../css/Relation.css'

class Relation extends Component {

    render() {
        const { coords, word, active, editWord, addRelation } = this.props

        const dX = coords.x2 - coords.x1
        const dY = coords.y2 - coords.y1

        const labelStyle = {
            left: coords.x1 + dX*0.66 + 'px',
            top: coords.y1 + dY*0.66 + 'px'
        }

        const grabStyle = {
            left: coords.x1 + dX*0.4 + 'px',
            top: coords.y1 + dY*0.4 + 'px'
        }

        const click = event => {
            addRelation(word.index)
            event.stopPropagation()
        }

        const edit = selected => {
            if (selected.value !== word.relation) editWord(word.index, {relation: selected.value})
        }

        const cls = `relation ${active ? 'relation--active' : ''}`

        //Setup select
        let relations = CONLLU.relations()
        relations = relations.map(relation => {
            return {value: relation, label: relation}
        })
        const value = {value: word.relation, label: word.relation ? word.relation : "?"}

        return (
            <div className={cls}>
                <div className="relation__label" style={labelStyle}>
                    <Select value={value} options={relations} onChange={edit} noResultsText="-" clearable={false} />
                </div>
                <button className="relation__grab" onClick={click} style={grabStyle}></button>
            </div>
        )
    }

}

export default Relation;
