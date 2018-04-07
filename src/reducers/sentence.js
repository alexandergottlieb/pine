import Sentence from "../classes/Sentence"
import Word from "../classes/Word"

const initial = null

const sentence = (state = initial, action) => {
    switch (action.type) {
        case "CURRENT_SENTENCE_UPDATE": {
            const words = state && state.words ? state.words.map(word => new Word(word)) : []
            return new Sentence({...action.sentence, words})
        }
        case "WORDS_UPDATE": {
            return new Sentence({ ...state, words: action.words.map(word => new Word(word)) })
        }
        case "SENTENCE_EDIT": {
            return new Sentence({...state, ...action.sentence})
        }
        case "SET_CURRENT_SENTENCE":
        case "SENTENCES_CHANGED_TREEBANK":
        case "USER_LOGOUT": {
            return initial
        }
        default:
            return state
    }
}

export default sentence
