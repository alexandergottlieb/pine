import React, { Component } from 'react';
import { Creatable } from 'react-select';
import uniqid from 'uniqid'
import 'react-select/dist/react-select.css';
import '../css/Relation.css'

class Relation extends Component {

    render() {
        const { coords, word, active, editWord, actions, relations } = this.props
        const { addRelation, createRelationLabel } = actions

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
            if (selected.value !== word.relation) {
                if (selected.new) createRelationLabel(selected.label, selected.value)
                editWord(word.index, {relation: selected.value})
            }
        }

        const newRelation = option => {
            const value = uniqid()
            return {
                ...option,
                value,
                new: true
            }
        }

        const cls = `relation ${active ? 'relation--active' : ''}`

        //Setup select
        let relationOptions = []
        let label = "_"
        for (const key in relations) {
            relationOptions.push({
                value: key,
                label: relations[key]
            })
            if (word.relation == key) label = relations[key]
        }
        relationOptions.push({
            value: "_",
            label: "_"
        })
        const value = {value: word.relation, label}

        return (
            <div className={cls}>
                <div className="relation__label" style={labelStyle}>
                    <Creatable
                        value={value}
                        options={relationOptions}
                        onChange={edit}
                        promptTextCreator={(label) => `Create '${label}'`}
                        clearable={false}
                        newOptionCreator={newRelation}
                    />
                </div>
                <button className="relation__grab" onClick={click} style={grabStyle}></button>
            </div>
        )
    }

}

export default Relation;
