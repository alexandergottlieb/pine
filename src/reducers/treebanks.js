const treebanks = (state = {}, action) => {
    switch (action.type) {
        case "TREEBANKS_UPDATED":
            return Object.assign({}, action.treebanks)
        case "TREEBANK_DELETE_SUCCEEDED":
            let newState = Object.assign({}, state)
            delete newState[action.id]
            return newState
        default:
            return state
    }
}

export default treebanks
