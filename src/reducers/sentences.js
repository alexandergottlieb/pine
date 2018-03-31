import Sentence from "../classes/Sentence"
import Word from "../classes/Word"

const initial = []

const sentences = (state = initial, action) => {
    switch (action.type) {
        case "SENTENCES_CHANGED_TREEBANK": {
            return []
        }
        case "SENTENCES_UPDATE": {
            return action.sentences.map(sentence => {
                const existing = state.find(old => old.id === sentence.id)
                const words = existing ? existing.words : []
                return new Sentence({...sentence, words})
            })
        }
        case "WORDS_UPDATE": {
            if (!state[action.sentence]) state[action.sentence] = new Sentence()
            return state.map( sentence => {
                if (action.sentence === sentence.id) {
                    return new Sentence({ ...sentence, words: action.words.map(word => new Word(word)) })
                } else {
                    return new Sentence(sentence)
                }
            })
        }
        case "SENTENCE_EDIT_START": {
            //Optimistic update
            return state.map(sentence => {
                if (action.sentence === sentence.id) {
                    return new Sentence({
                        ...sentence,
                        ...action.data
                    })
                }
                return new Sentence(sentence)
            })
        }
        case "WORD_EDIT_START": {
            //Optimistic update
            return state.map(sentence => {
                let newSentence = new Sentence(sentence)
                newSentence.words = newSentence.words.map(word => {
                    if (word.id === action.word) word = {...word, ...action.data}
                    return word
                })
                return newSentence
            })
        }
        case "WORDS_EDIT_START": {
            return state.map(sentence => {
                let newSentence = new Sentence(sentence)
                newSentence.words = action.words.map(word => word)
                //Sort by id
                newSentence.words.sort( (a, b) => {
                    if (a.index < b.index) {
                        return -1;
                    } else if (a.index > b.index) {
                        return 1;
                    } else {
                        return 0;
                    }
                })
                return newSentence
            })
        }
        case "USER_LOGOUT": {
            return initial
        }
        default:
            return state
    }
}

export default sentences
