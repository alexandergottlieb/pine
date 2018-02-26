import Sentence from "../classes/Sentence"
const sentences = (state = [], action) => {
    switch (action.type) {
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
                    const words = action.words
                    return Object.assign(new Sentence(), sentence, { words })
                }
                return new Sentence(sentence)
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
        default:
            return state
    }
}

export default sentences
