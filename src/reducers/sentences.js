import Sentence from "../classes/Sentence"
import Word from "../classes/Word"

const initial = []

const sentences = (state = initial, action) => {
    switch (action.type) {
        case "SENTENCES_CHANGED_TREEBANK": {
            return []
        }
        case "SENTENCES_UPDATE": {
            return action.sentences.map(sentence => new Sentence(sentence))
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
        case "USER_LOGOUT": {
            return initial
        }
        default:
            return state
    }
}

export default sentences
