import { combineReducers } from "redux";

const user = (state = {}, action) => {
    switch (action.type) {
        default:
            return state
    }
}

const treebanks = (state = {all: {}, current: null}, action) => {
    switch (action.type) {
        case "SET_TREEBANK":
            return Object.assign({}, state, {
                current: action.treebank
            })
        case "FETCH_TREEBANKS_COMPLETE":
            return Object.assign({}, state, {
                all: action.treebanks
            })
        default:
            return state
    }
}

const reducers = combineReducers({
    user, treebanks
});

export default reducers;
