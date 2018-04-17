import { database } from "./firebaseApp"

//Track listeners on firebase endpoints to aviod duplication
let watchers = {
    treebank: null,
    sentences: null,
    words: null
}

const syncTreebank = (dispatch, treebank) => {
    //Stop syncing if deselected
    if (!treebank && watchers.treebank) {
        database.ref(watchers.treebank).off("value")
        watchers.treebank = null
    }
    //Start or update sync
    const endpoint = `/treebanks/${treebank}`
    if (treebank && watchers.treebank !== endpoint) {
        if (watchers.treebank) database.ref(watchers.treebank).off("value")
        watchers.treebank = endpoint
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
    }
}

const syncSentences = (dispatch, treebank, currentSentence) => {
    //Stop syncing if deselected
    if (!treebank && watchers.sentences) {
        database.ref(watchers.sentences).off("value")
        watchers.sentences = null
    }
    //Start or update sync
    const endpoint = `/sentences/${treebank}`
    if (treebank && watchers.sentences !== endpoint) {
        //Replace existing watcher
        if (watchers.sentences) database.ref(watchers.sentences).off("value")
        watchers.sentences = endpoint
        dispatch({type: "SENTENCES_CHANGED_TREEBANK"})
        database.ref(endpoint).orderByChild("index").on("value", snapshot => {
            let sentences = []
            snapshot.forEach(data => {
                sentences.push(data.val())
            })
            dispatch({
                type: "SENTENCES_UPDATE",
                treebank, sentences
            })
            //Update the current sentence
            if (currentSentence) {
                const updatedSentence = sentences.find(sentence => sentence.id === currentSentence)
                dispatch({
                    type: "CURRENT_SENTENCE_UPDATE",
                    sentence: updatedSentence
                })
            }
        })
    }
}

const syncWords = (dispatch, treebank, sentence) => {
    //Stop syncing if deselected
    if (!sentence && watchers.words) {
        database.ref(watchers.words).off("value")
        watchers.words = null
    }
    //Start or update sync
    const endpoint = `/words/${treebank}/${sentence}`
    if (sentence && watchers.words !== endpoint) {
        if (watchers.words) database.ref(watchers.words).off("value")
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

//Track previous treebank and sentence to detect change
let previous = {
    treebank: null,
    sentence: null
}
export const sync = (dispatch, state) => {
    const { current } = state
    const { treebank, sentence } = current
    //If treebank has changed, sync treebank and sentences
    if (previous.treebank !== treebank) {
        previous.treebank = treebank
        syncTreebank(dispatch, treebank)
        syncSentences(dispatch, treebank, sentence)
    }
    //If sentence has changed, sync words
    if (previous.sentence !== sentence) {
        previous.sentence = sentence
        syncWords(dispatch, treebank, sentence)
    }
}
