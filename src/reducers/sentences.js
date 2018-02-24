const sentences = (state = [], action) => {
    switch (action.type) {
        case "SENTENCES_UPDATE": {
            let newState = state.slice(0)
            action.sentences.forEach( (sentence, index) => {
                const oldSentence = newState[index] || {}
                newState[index] = Object.assign({words: []}, oldSentence, sentence)
            })
            return newState
        }
        case "WORDS_UPDATE": {
            if (!state[action.sentence]) state[action.sentence] = { sentence: "", words: [], comments:[] }
            return state.map( (sentence, index) => {
                if (Number(action.sentence) === Number(index)) {
                    const words = action.words
                    return {
                        ...sentence,
                        words
                    }
                } else {
                    return sentence
                }
            })
        }
        case "SENTENCE_EDIT": {
            let newState = state.slice(0)
            Object.assign(newState[action.sentence], action.data)
            return newState
        }
        case "WORD_EDIT": {
            let newState = state.slice(0)
            Object.assign(newState[action.sentence].words[action.word], action.data)
            return newState
        }
        default:
            return state
    }
}

export default sentences
