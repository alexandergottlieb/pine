const sentences = (state = [], action) => {
    switch (action.type) {
        case "UPDATE_CURRENT_SENTENCES":
            return action.sentences.slice(0) //slice creates new array
        case "EDIT_WORD":
            let newState = state.slice(0)
            Object.assign(newState[action.sentenceID].words[action.wordID], action.data)
            return newState
        default:
            return state
    }
}

export default sentences
