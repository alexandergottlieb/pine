const sentences = (state = {}, action) => {
    switch (action.type) {
        case "SENTENCES_UPDATE": {
            let newState = Object.assign({}, state)
            newState[action.treebank] = action.sentences.slice(0)
            return newState
        }
        case "SENTENCE_EDIT":
        case "SENTENCE_UPDATE": {
            let newState = Object.assign({}, state)
            Object.assign(newState[action.treebank][action.sentence], action.data)
            return newState
        }
        default:
            return state
    }
}

export default sentences
