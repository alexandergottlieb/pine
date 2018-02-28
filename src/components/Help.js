import React from "react"
import { Link } from "react-router-dom"
import Button from "./Button"
import "../css/Help.css"

const Help = props => {
    return (
        <div className="help">
            <h2>Help</h2>
            <h3>How to Edit...</h3>
            <h4>Words</h4>
            <p>Clicking a word in the tree reveals its grammatical information which can be edited in place.</p>
            <h4>Relations</h4>
            <p>
                Lines between words represent grammatical relations. Clicking <span class="far fa-circle"></span> along a line selects that relation. You can select many at a time. Clicking again on a word points the selected relations to that word. Subtrees (descendent words) are moved along with their parents.
            </p>
            <p>The type of the relation is also labelled along the line, click it to edit. Relation labels are unique to each treebank. You can change these in <span class="fas fa-cog"></span> Settings.</p>
            <h4>A Sentence</h4>
            <p>The order of words can be changed by dragging and dropping them into different positions in the sentence.</p>
            <p>New words are added by clicking <span class="fas fa-plus-circle"></span> on the right of the sentence.</p>
            <h3>Saving Changes</h3>
            <p>All changes are saved online in real time. You can download the updated CoNLL-U file from your <Link to="/">treebanks</Link>.</p>
            <h3>More</h3>
            <a href="https://alexandergottlieb.gitbooks.io/treebanker/" target="_blank">
                <Button type="secondary-dark" icon="fa-book">Documentation</Button>
            </a>
        </div>
    )
}

export default Help
