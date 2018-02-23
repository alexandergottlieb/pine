const words = (state = [], action) => {
    switch (action.type) {
        case "EDIT_WORD": {
            let newState = state.slice(0)
            Object.assign(newState[action.word], action.data)
            return newState
        }
        case "WORDS_UPDATE": {
            let newState = state.slice(0)
            newState = action.data
            return newState
        }
        default:
            return state
    }
}

export default words
