import { database } from "../firebaseApp"

//Track listeners on firebase endpoints to aviod duplication
let watchers = {
    treebanks: null,
    words: null,
    sentences: null
}

export const syncTreebanks = () => {
    return dispatch => {
        if (!watchers.treebanks) {
            const ref = database.ref("/treebanks")
            ref.on("value", snapshot => {
                dispatch({
                    type: "TREEBANKS_UPDATED",
                    treebanks: snapshot.val()
                })
            })
            watchers.treebanks = "/treebanks"
        }
    }
}

export const syncSentences = (treebank) => {
    return dispatch => {
        const endpoint = `/sentences/${treebank}`
        if (watchers.sentences !== endpoint) {
            //Replace existing watcher
            if (watchers.sentences) database.ref(watchers.sentences).off()
            watchers.sentences = endpoint
            database.ref(endpoint).orderByChild("index").on("value", snapshot => {
                let data = snapshot.val() || {}
                let sentences = Object.values(data)
                dispatch({
                    type: "SENTENCES_UPDATE",
                    treebank, sentences
                })
            })
        }
    }
}

export const syncWords = (treebank, sentence) => {
    return dispatch => {
        const endpoint = `/words/${treebank}/${sentence}`
        if (watchers.words !== endpoint) {
            //Replace existing watcher
            if (watchers.words) database.ref(watchers.words).off()
            watchers.words = endpoint
            database.ref(endpoint).orderByChild("index").on("value", snapshot => {
                let words = snapshot.val() || {}
                words = Object.values(words)
                dispatch({
                    type: "WORDS_UPDATE",
                    treebank, sentence, words
                })
            })
        }
    }
}
