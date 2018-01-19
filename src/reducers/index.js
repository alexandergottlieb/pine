import { combineReducers } from "redux";

const user = (state = {}, action) => {
    switch (action.type) {
        default:
            return state
    }
}

const treebanks = (state = {}, action) => {
    switch (action.type) {
        case "FETCH_TREEBANKS_COMPLETE":
            return Object.assign({}, action.treebanks)
        case "DELETE_TREEBANK_SUCCEEDED":
            let newState = Object.assign({}, state)
            delete newState[action.id]
            return newState
        default:
            return state
    }
}

const sentences = (state = [], action) => {
    switch (action.type) {
        case "FETCH_SENTENCES_COMPLETE":
            return Object.assign({}, action.sentences)
        default:
            return state
    }
}
const reducers = combineReducers({
    user, treebanks, sentences
});

export default reducers;
