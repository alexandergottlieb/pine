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

const current = (state = {treebank: null, sentences: [], sentence: null}, action) => {
    switch (action.type) {
        case "SET_CURRENT_TREEBANK":
            return Object.assign({}, state, {
               treebank: action.id
            })
        case "SET_CURRENT_SENTENCE":
            return Object.assign({}, state, {
               sentence: action.id
            })
        case "UPDATE_CURRENT_SENTENCES":
            return Object.assign({}, state, {
               sentences: action.sentences
            })
        default:
            return state
    }
}
const reducers = combineReducers({
    user, treebanks, current
});

export default reducers;
