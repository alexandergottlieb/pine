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
        case "UPDATE_CURRENT_SENTENCES":
            return action.sentences.slice(0)
        default:
            return state
    }
}

const current = (state = {treebank: null, sentence: null, word: null}, action) => {
    switch (action.type) {
        case "SET_CURRENT_TREEBANK":
            return Object.assign({}, state, {
               treebank: action.id
            })
        case "SET_CURRENT_SENTENCE":
            return Object.assign({}, state, {
               sentence: action.id
            })
        case "SET_CURRENT_WORD":
            return Object.assign({}, state, {
               word: action.id
            })
        default:
            return state
    }
}
const reducers = combineReducers({
    user, treebanks, sentences, current
});

export default reducers;
