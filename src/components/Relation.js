import React, { Component } from 'react';
import '../css/Relation.css'

class Relation extends Component {

    render() {
        const { coords, word, active, actions } = this.props

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

        const down = event => {
            actions.setRelation(word.index)
        }

        const click = event => {
            event.stopPropagation()
        }

        const cls = `relation ${active ? 'relation--active' : ''}`

        return (
            <div className={cls}>
                <span className="relation__label" style={labelStyle}>{word.relation}</span>
                <button className="relation__grab" onClick={click} onMouseDown={down} style={grabStyle}></button>
            </div>
        )
    }

}

export default Relation;
