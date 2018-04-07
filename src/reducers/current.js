import { ActionTypes as UndoActionTypes } from "redux-undo"

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
    newSentence: null,
    feedback: '',
    undoing: false,
    editing: false
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
        case "EXPORT_TREEBANK_START": {
            let newState = Object.assign({}, state)
            if (newState.exports.downloading.indexOf(action.treebank === -1)) newState.exports.downloading.push(action.treebank)
            newState.feedback = "Exporting..."
            return newState
        }
        case "EXPORT_TREEBANK_COMPLETE": {
            let newState = Object.assign({}, state)
            //treebank no longer downloading
            newState.exports.downloading = newState.exports.downloading.filter(id => action.treebank !== id)
            newState.feedback = ""
            return newState
        }
        case "SENTENCE_CREATE_COMPLETE": {
            return {...state, newSentence: action.id}
        }
        case "SENTENCE_EDIT": {
            return {...state, feedback: "Saving...", editing: true}
        }
        case "SENTENCES_UPDATE": {
            return {...state, feedback: ""}
        }
        case "UPLOAD_TREEBANK_START": {
            return {...state, feedback: "Uploading..."}
        }
        case "UPLOAD_TREEBANK_SLOW": {
            return {...state, feedback: "Still uploading..."}
        }
        case "UPLOAD_TREEBANK_COMPLETE":
        case "UPLOAD_TREEBANK_FAIL": {
            return {...state, feedback: ""}
        }
        case UndoActionTypes.UNDO:
        case UndoActionTypes.REDO: {
            return {...state, messages: [], undoing: true}
        }
        case "SENTENCE_EDIT_PENDING": {
            return {...state, undoing: false, editing: false, feedback: "Saving..."}
        }
        case "SENTENCE_EDIT_COMPLETE": {
            return {...state, feedback: ""}
        }
        case "USER_LOGOUT": {
            return initial
        }
        default:
            return state
    }
}

export default current
