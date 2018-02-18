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

export default treebanks
