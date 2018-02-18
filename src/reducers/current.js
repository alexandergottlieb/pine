const current = (state = {treebank: null, sentence: null, word: null, relations: [], messages: []}, action) => {
    switch (action.type) {
        case "SET_CURRENT_TREEBANK": {
            return Object.assign({}, state, {
               treebank: action.id
            })
        }
        case "SET_CURRENT_SENTENCE": {
            return Object.assign({}, state, {
               sentence: action.id
            })
        }
        case "SET_CURRENT_WORD": {
            return Object.assign({}, state, {
               word: action.id
            })
        }
        case "ADD_CURRENT_RELATION": {
            let newState = Object.assign({}, state)
            newState.relations.push(Number(action.id))
            return newState
        }
        case "CLEAR_CURRENT_RELATIONS": {
            return Object.assign({}, state, {
                relations: []
            })
        }
        case "ADD_MESSAGE": {
            let newState = Object.assign({}, state)
            newState.messages.push({
                message: action.message,
                status: action.status
            })
            return newState
        }
        case "REMOVE_MESSAGE": {
            //Remove oldest message (FIFO)
            return Object.assign({}, state, {
                messages: state.messages.slice(1)
            })
        }
        default:
            return state
    }
}

export default current
