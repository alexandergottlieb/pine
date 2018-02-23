import { database } from "../firebaseApp"
import FileSaver from "file-saver"
import CONLLU from "../classes/CONLLU"

//Track listeners on firebase endpoints to aviod duplication
let watchers = []

const stopWatching = endpoint => {
    watchers = watchers.filter(watcher => {
        const keep = watcher.indexOf(endpoint) !== 0
        if (!keep) database.ref(watcher).off('value')
        return keep
    })
}

export const addError = message => {
    return dispatch => {
        //Automatically remove message later
        setTimeout(() => dispatch({
            type: "REMOVE_MESSAGE"
        }), 3000)
        dispatch({
            type: "ADD_MESSAGE",
            message,
            status: "ERROR"
        })
    }
}

export const fetchTreebanks = () => {
    return dispatch => {
        if (watchers.indexOf("/treebanks") === -1) {
            watchers.push("/treebanks")
            const ref = database.ref("/treebanks")
            ref.on("value", snapshot => {
                dispatch({
                    type: "FETCH_TREEBANKS_COMPLETE",
                    treebanks: snapshot.val()
                })
            })
        }
    }
}

export const uploadTreebank = treebank => {
    return dispatch => {
        dispatch({ type: "UPLOAD_TREEBANK_STARTED" })
        const sentences = treebank.sentences
        treebank.sentences = treebank.sentences.length

        const treebankRef = database.ref("/treebanks").push()
        treebank.id = treebankRef.key
        treebankRef.set(treebank).then(() => {
            //Normalise sentences and words at eg. words/:treebankID/:sentenceID
            sentences.forEach( (sentence, index) => {
                const wordsRef = database.ref(`/words/${treebankRef.key}/${index}`)
                wordsRef.set(sentence.words)
                sentence.words = sentence.words.length
            })
            const sentencesRef = database.ref(`/sentences/${treebankRef.key}`)
            sentencesRef.set(sentences)

        })
    }
}

export const deleteTreebank = id => {
    return dispatch => {
        dispatch({ type: "DELETE_TREEBANK_STARTED" })
        database.ref(`/treebanks/${id}`).remove().then(() => {
            database.ref(`/sentences/${id}`).remove().then(() => {
                database.ref(`/words/${id}`).remove().then(() => {
                    dispatch({ type: "DELETE_TREEBANK_SUCCEEDED", id })
                })
            })
        })
    }
}

export const syncSentences = (treebank) => {
    return dispatch => {
        const endpoint = `/sentences/${treebank}`
        if (watchers.indexOf(endpoint) === -1) {
            //Remove existing watcher
            stopWatching("/sentences/")
            database.ref(endpoint).orderByKey().on("value", snapshot => {
                const sentences = snapshot.val() || []
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
        if (watchers.indexOf(endpoint) === -1) {
            stopWatching("/words/")
            watchers.push(endpoint)
            database.ref(endpoint).orderByKey().on('value', snapshot => {
                const words = snapshot.val()
                dispatch({
                    type: "WORDS_UPDATE",
                    words
                })
            })
        }
    }
}

export const setCurrent = (treebank, sentence = null) => {
    return dispatch => {
        dispatch({
            type: "SET_CURRENT_TREEBANK",
            id: treebank
        })
        dispatch({
            type: "SET_CURRENT_SENTENCE",
            id: sentence
        })
        //Watch changes to words sentence
        if (sentence) dispatch(syncWords(treebank, sentence))
        //Watch changes to sentences in treebank
        dispatch(syncSentences(treebank))
    }
}

export const setWord = (id = null) => {
    return {
        type: "SET_CURRENT_WORD",
        id
    }
}

export const addRelation = (id = null) => {
    return {
        type: "ADD_CURRENT_RELATION",
        id
    }
}

export const clearRelations = () => {
    return {
        type: "CLEAR_CURRENT_RELATIONS"
    }
}

export const editWord = (treebank, sentence, word, data) => {
    return dispatch => {
        dispatch({
            type: "WORD_EDIT",
            treebank, sentence, word, data
        })
        const ref = database.ref(`/words/${treebank}/${sentence}/${word}`)
        ref.update(data)
    }
}

export const editSentence = (treebank, sentence, data) => {
    return dispatch => {
        dispatch({
            type: "SENTENCE_EDIT",
            treebank, sentence, data
        })
        const ref = database.ref(`/sentences/${treebank}/${sentence}`)
        ref.update(data)
    }
}

export const queueExportTreebank = (treebankID) => {
    return dispatch => {
        dispatch({
            type: "EXPORT_TREEBANK_STARTED",
            treebank: treebankID
        })
        dispatch(syncSentences(treebankID))
    }
}

export const exportTreebank = (treebank, sentences) => {
    const conllu = new CONLLU(treebank.name, sentences)
    const text = conllu.export()
    const blob = new Blob([text])
    const filename = `${treebank.name}.conllu`
    FileSaver.saveAs(blob, filename)
    return {
        type: "EXPORT_TREEBANK_COMPLETED",
        treebank: treebank.id
    }
}
