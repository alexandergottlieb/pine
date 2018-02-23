const words = (state = [], action) => {
    switch (action.type) {
        case "EDIT_WORD": {
            let newState = state.slice(0)
            Object.assign(newState[action.word], action.data)
            return newState
        }
        case "WORDS_UPDATE": {
            let newState = []
            action.words.forEach(word => newState[word.index] = Object.assign({}, word))
            return newState
        }
        default:
            return state
    }
}

export default words
