import Sentence from "../classes/Sentence"
import Word from "../classes/Word"

const sentences = (state = [], action) => {
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
        case "SENTENCE_EDIT": {
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
        case "WORD_EDIT": {
            return state.map(sentence => {
                let newSentence = new Sentence(sentence)
                newSentence.words = newSentence.words.map(word => {
                    if (word.id === action.word) word = {...word, ...action.data}
                    return word
                })
                return newSentence
            })
        }
        case "WORDS_EDIT": {
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
        default:
            return state
    }
}

export default sentences
