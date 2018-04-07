import { combineReducers } from "redux"
import undoable, { includeAction, groupByActionTypes } from "redux-undo";
import user from "./user"
import treebanks from "./treebanks"
import sentences from "./sentences"
import current from "./current"
import permissions from "./permissions"
import sentence from "./sentence"

const reducer = combineReducers({
    user, treebanks, sentences, current, permissions,
    sentence: undoable(sentence, {
        filter: includeAction(["SENTENCE_EDIT"]),
        limit: 20,
        initTypes: ["SENTENCES_CHANGED_TREEBANK", "SET_CURRENT_SENTENCE", "USER_LOGOUT"]
    })
});

export default reducer
