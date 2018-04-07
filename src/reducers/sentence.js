import Sentence from "../classes/Sentence"
import Word from "../classes/Word"

const initial = new Sentence()

const sentence = (state = initial, action) => {
    switch (action.type) {
        case "SENTENCES_CHANGED_TREEBANK": {
            return initial
        }
        case "SET_CURRENT_SENTENCE": {
            console.log('set sentence', action.sentence)
            return new Sentence(action.sentence)
        }
        case "SENTENCES_UPDATE": {
            const id = state && state.id ? state.id : null
            const updatedSentence = action.sentences.find(sentence => sentence.id === id) || initial
            const words = state && state.words ? state.words : []
            return new Sentence({...state, ...updatedSentence, words})
        }
        case "WORDS_UPDATE": {
            return new Sentence({ ...state, words: action.words.map(word => new Word(word)) })
        }
        case "SENTENCE_EDIT": {
            return new Sentence({...state, ...action.sentence})
        }
        case "USER_LOGOUT": {
            return initial
        }
        default:
            return state
    }
}

export default sentence
