import { database } from "../firebaseApp"

//Track listeners on firebase endpoints to aviod duplication
let watchers = {
    treebank: null,
    words: null,
    sentences: null
}

export const syncTreebank = (treebankID) => {
    return dispatch => {
        const endpoint = `/treebanks/${treebankID}`
        if (watchers.treebank !== endpoint) {
            dispatch({
                type: "TREEBANK_SYNC_START",
                treebank: treebankID
            })
            database.ref(endpoint).on("value", snapshot => {
                const treebank = snapshot.val()
                if (treebank) {
                    dispatch({
                        type: "TREEBANK_SYNC_UPDATE",
                        treebank: snapshot.val()
                    })
                } else {
                    //Treebank deleted
                    database.ref(endpoint).off("value")
                    watchers.treebank = null
                }
            })
            watchers.treebank = endpoint
        }
    }
}

export const syncSentences = (treebank) => {
    return (dispatch) => {
        const endpoint = `/sentences/${treebank}`
        if (watchers.sentences !== endpoint) {
            dispatch({type: "SENTENCES_CHANGED_TREEBANK"})
            //Replace existing watcher
            if (watchers.sentences) database.ref(watchers.sentences).off()
            watchers.sentences = endpoint
            database.ref(endpoint).orderByChild("index").on("value", snapshot => {
                let sentences = []
                snapshot.forEach(data => {
                    sentences.push(data.val())
                })
                dispatch({
                    type: "SENTENCES_UPDATE",
                    treebank, sentences
                })
            })
        }
    }
}

export const syncWords = (treebank, sentence) => {
    return (dispatch) => {
        const endpoint = `/words/${treebank}/${sentence}`
        if (watchers.words !== endpoint) {
            //Replace existing watcher
            if (watchers.words) database.ref(watchers.words).off()
            watchers.words = endpoint
            database.ref(endpoint).orderByChild("index").on("value", snapshot => {
                let words = []
                snapshot.forEach(data => {
                    words.push(data.val())
                })
                dispatch({
                    type: "WORDS_UPDATE",
                    treebank, sentence, words
                })
            })
        }
    }
}
