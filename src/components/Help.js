import React from "react"
import { Link } from "react-router-dom"
import Button from "./Button"
import "../css/Help.css"

const Help = props => {
    return (
        <div className="help">
            <h2>Help</h2>
            <h3>Interface</h3>
            <p>Select sentences using the list on the left.</p>
            <p>Along the bottom of the editor are a number of buttons.</p>
            <ul>
                <li>The blue button switches between viewing the sentence as a tree or with dependency arrows drawn above the words. Relations can only be edited while viewing as a tree.</li>
                <li><span className="fas fa-undo"></span> and <span className="fas fa-redo"></span> undo or redo your last edit, so don't worry if you make a mistake.</li>
                <li><span className="fas fa-plus"></span> and <span className="fas fa-minus"></span> zoom in and out.</li>
            </ul>
            <p>When you're finished editing, click <em>Treebanks</em> in the top left to go home.</p>
            <h3>How to Edit...</h3>
            <h4>Words</h4>
            <p>Clicking a word in the tree reveals its grammatical information which can be edited in place.</p>
            <h4>Relations</h4>
            <p>
                Lines between words represent grammatical relations. Clicking <span className="far fa-circle"></span> along a line selects that relation. You can select many at a time. Clicking again on a word points the selected relations to that word. Subtrees (descendent words) are moved along with their parents.
            </p>
            <p>The type of the relation is also labelled along the line, click it to edit. Relation labels are unique to each treebank. You can change these in the treebank settings.</p>
            <h4>A Sentence</h4>
            <p>The order of words can be changed by dragging and dropping them into different positions.</p>
            <p>New words are added by clicking the <span className="fas fa-plus-circle"></span> to the right of the sentence.</p>
            <h3>Saving Changes</h3>
            <p>All changes are saved online in real time. You can download the updated CoNLL-U file from your <Link to="/">treebanks</Link>.</p>
            <h3>More</h3>
            <p>To learn more, read the docs:</p>
            <a href="https://docs.pine.alexandergottlieb.com/" target="_blank">
                <Button type="primary" icon="fa-book">Documentation</Button>
            </a>
        </div>
    )
}

export default Help
