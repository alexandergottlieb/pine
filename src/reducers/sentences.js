const sentences = (state = {}, action) => {
    switch (action.type) {
        case "FETCHED_SENTENCES": {
            let newState = Object.assign({}, state)
            newState[action.treebank] = action.sentences.slice(0)
            return newState
        }
        case "EDIT_WORD": {
            let newState = Object.assign({}, state)
            Object.assign(newState[action.treebank][action.sentence].words[action.word], action.data)
            return newState
        }
        case "EDIT_SENTENCE": {
            let newState = Object.assign({}, state)
            Object.assign(newState[action.treebank][action.sentence], action.data)
            return newState
        }
        default:
            return state
    }
}

export default sentences
