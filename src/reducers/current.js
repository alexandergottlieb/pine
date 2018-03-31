const initial = {
    treebank: null,
    sentence: null,
    word: null,
    relations: [],
    messages: [],
    exports: {
        downloading: [],
        ready: []
    },
    newSentence: null
}

const current = (state = initial, action) => {
    switch (action.type) {
        case "SET_CURRENT_TREEBANK": {
            return {...state, treebank: action.id, messages: []}
        }
        case "SET_CURRENT_SENTENCE": {
            let newSentence = action.id === state.newSentence ? null : state.newSentence //Clear new sentence redirect
            return {...state, sentence: action.id, messages: [], newSentence}
        }
        case "SET_CURRENT_PAGE": {
            return {...state, page: action.page, messages: []}
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
            const { message, status } = action
            //Add message and only keep the latest 3
            let messages = state.messages.slice(-2)
            messages.push({ message, status })
            return { ...state, messages }
        }
        case "REMOVE_MESSAGE": {
            //Remove oldest message (FIFO)
            return Object.assign({}, state, {
                messages: state.messages.slice(1)
            })
        }
        case "CLEAR_MESSAGES": {
            return {...state, messages: []}
        }
        case "EXPORT_TREEBANK_STARTED": {
            let newState = Object.assign({}, state)
            if (newState.exports.downloading.indexOf(action.treebank === -1)) newState.exports.downloading.push(action.treebank)
            return newState
        }
        case "EXPORT_TREEBANK_COMPLETED": {
            let newState = Object.assign({}, state)
            //treebank no longer downloading
            newState.exports.downloading = newState.exports.downloading.filter(id => action.treebank !== id)
            return newState
        }
        case "SENTENCE_CREATED": {
            return {...state, newSentence: action.id}
        }
        case "USER_LOGOUT": {
            return initial
        }
        default:
            return state
    }
}

export default current
