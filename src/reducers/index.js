import { combineReducers } from "redux";

const user = (state = {}, action) => {
    switch (action.type) {
        default:
            return state
    }
}

const treebank = (state = null, action) => {
    switch (action.type) {
        case "SET_TREEBANK":
            return action.treebank
        default:
            return state
    }
}

const reducers = combineReducers({
    user, treebank
});

export default reducers;
