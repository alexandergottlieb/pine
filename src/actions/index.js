import { database } from "../firebaseApp"
import FileSaver from "file-saver"
import Treebank from "../classes/Treebank"
import Sentence from "../classes/Sentence"

import { syncTreebanks, syncSentences, syncWords } from "./sync"
export * from "./sync"
export * from "./user.js"
export * from "./sharing.js"

export const addError = (message, autoDismiss = true) => {
    return dispatch => {
        dispatch(addMessage(message, true, autoDismiss))
    }
}

export const addMessage = (message, error = false, autoDismiss = true) => {
    return dispatch => {
        //Automatically remove message later
        if (autoDismiss) {
            setTimeout(() => dispatch({
                type: "REMOVE_MESSAGE"
            }), 3000)
        }
        dispatch({
            type: "ADD_MESSAGE",
            message,
            status: error ? "ERROR" : "NORMAL"
        })
    }
}

export const clearMessages = () => {
    return {
        type: "CLEAR_MESSAGES"
    }
}

export const uploadTreebank = (treebank) => {
    return (dispatch, getState) => {
        const { user } = getState()
        dispatch({ type: "UPLOAD_TREEBANK_STARTED" })
        const sentences = treebank.sentences
        treebank.sentences = treebank.sentences.length

        const treebankRef = database.ref(`/treebanks`).push()
        const treebankID = treebankRef.key
        treebank.id = treebankID
        treebank.owner = user.uid
        treebankRef.set(treebank).then(() => {
            //Add treebank to user's collection
            database.ref(`/permissions/${user.uid}/treebanks/${treebankID}`).set(true)
            //Normalise sentences and words at eg. words/:treebankID/:sentenceID
            let sentenceUpdates = {}
            let wordUpdates = {}
            sentences.forEach( sentence => {
                const sentenceID = database.ref(`/sentences/${treebankID}`).push().key
                sentence.words.forEach( word => {
                    const wordID = database.ref(`/words/${treebankID}/${sentenceID}`).push().key
                    word.id = wordID
                    wordUpdates[`${sentenceID}/${wordID}`] = word
                })
                sentenceUpdates[sentenceID] = {...sentence, id: sentenceID, words: null}
            })
            //Batch requests
            database.ref(`/sentences/${treebankID}`).update(sentenceUpdates)
            database.ref(`/words/${treebankID}`).update(wordUpdates)
        })
    }
}

export const deleteTreebank = (id) => {
    return (dispatch, getState) => {
        const { user } = getState()
        dispatch({ type: "TREEBANK_DELETE_STARTED" })
        database.ref(`/treebanks/${id}`).remove().then(() => {
            database.ref(`/sentences/${id}`).remove().then(() => {
                database.ref(`/words/${id}`).remove().then(() => {
                    database.ref(`/permissions/${user.uid}/treebanks/${id}`).remove().then(() => {
                        dispatch({ type: "TREEBANK_DELETE_SUCCEEDED", id })
                    })
                })
            })
        })
    }
}

export const queueExportTreebank = (treebankID) => {
    return (dispatch) => {
        dispatch({
            type: "EXPORT_TREEBANK_STARTED",
            treebank: treebankID
        })
        database.ref(`/treebanks/${treebankID}`).once('value', snapshot => {
            let treebank = snapshot.val()
            database.ref(`/sentences/${treebankID}`).orderByKey().once('value', snapshot => {
                //Array-ify
                treebank.sentences = Object.values(snapshot.val())
                database.ref(`/words/${treebankID}`).orderByKey().once('value', snapshot => {
                    const wordsBySentence = snapshot.val()
                    //Array-ify
                    treebank.sentences = treebank.sentences.map(data => {
                        data.words = Object.values(wordsBySentence[data.id])
                        return new Sentence(data)
                    })
                    const conllu = new Treebank(treebank)
                    console.log('conllu', conllu)
                    const text = conllu.export()
                    const blob = new Blob([text])
                    const filename = `${treebank.name}.conllu`
                    FileSaver.saveAs(blob, filename)
                    dispatch({
                        type: "EXPORT_TREEBANK_COMPLETED",
                        treebank: treebank.id
                    })
                })
            })
        })
    }
}

export const setCurrent = (treebank, sentence = null, page = null) => {
    return dispatch => {
        dispatch({
            type: "SET_CURRENT_TREEBANK",
            id: treebank
        })
        dispatch({
            type: "SET_CURRENT_SENTENCE",
            id: sentence
        })
        dispatch({
            type: "SET_CURRENT_PAGE",
            page
        })
        //Watch changes to sentences in treebank
        dispatch(syncSentences(treebank))
        //Watch changes to words in sentence
        if (sentence) dispatch(syncWords(treebank, sentence))
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

export const editSentence = (treebank, sentence, data) => {
    return dispatch => {
        dispatch({
            type: "SENTENCE_EDIT",
            treebank, sentence, data
        })
        database.ref(`/sentences/${treebank}/${sentence}`).update(data)
    }
}

export const editWord = (treebank, sentence, word, data) => {
    return (dispatch) => {
        dispatch({
            type: "WORD_EDIT",
            treebank, sentence, word, data
        })
        const ref = database.ref(`/words/${treebank}/${sentence}/${word}`)
        ref.update(data)
    }
}

export const editWords = (treebank, sentence, words) => {
    return (dispatch) => {
        let updates = {}
        words.forEach(word => updates[word.id] = word)
        dispatch({
            type: "WORDS_EDIT",
            treebank, sentence, words
        })
        const ref = database.ref(`/words/${treebank}/${sentence}`)
        ref.set(updates)
    }
}

export const createWord = (treebank, sentence, data) => {
    return (dispatch) => {
        dispatch({type: "WORD_CREATE_STARTED"})
        const key = database.ref(`/words/${treebank}/${sentence}`).ref.push().key
        database.ref(`/words/${treebank}/${sentence}/${key}`).set({
            ...data,
            id: key
        }).then(() => {
            dispatch({type: "WORD_CREATE_COMPLETED"})
        })
    }
}

export const createRelationLabel = (label, value) => {
    return (dispatch, getState) => {
        const { current } = getState()
        database.ref(`/treebanks/${current.treebank}/settings/relations/${value}`).set(label).then(() => {
            dispatch({
                type: "RELATION_LABEL_CREATED"
            })
        })
    }
}

export const createSentence = sentence => {
    return (dispatch, getState) => {
        const { current } = getState()
        const sentenceID = database.ref(`/sentences/${current.treebank}`).push().key
        database.ref(`/sentences/${current.treebank}/${sentenceID}`).set({...sentence, id: sentenceID, words: null})
        let words = {}
        sentence.words.forEach( word => {
            const wordID = database.ref(`/words/${current.treebank}/${sentenceID}`).push().key
            word.id = wordID
            words[wordID] = word
        })
        database.ref(`/words/${current.treebank}/${sentenceID}`).set(words)
        dispatch({
            type: "SENTENCE_CREATED"
        })
    }
}
