import { database } from "../firebaseApp"
import FileSaver from "file-saver"
import CONLLU from "../classes/CONLLU"

import { syncTreebanks, syncSentences, syncWords } from "./sync"
export * from "./sync"
export * from "./user.js"

export const addError = message => {
    return dispatch => {
        dispatch(addMessage(message, true))
    }
}

export const addMessage = (message, error = false) => {
    return dispatch => {
        //Automatically remove message later
        setTimeout(() => dispatch({
            type: "REMOVE_MESSAGE"
        }), 3000)
        dispatch({
            type: "ADD_MESSAGE",
            message,
            status: error ? "ERROR" : "NORMAL"
        })
    }
}

export const uploadTreebank = (treebank) => {
    return (dispatch, getState) => {
        const { user } = getState()
        dispatch({ type: "UPLOAD_TREEBANK_STARTED" })
        const sentences = treebank.sentences
        treebank.sentences = treebank.sentences.length

        const treebankRef = database.ref(`/user/${user.uid}/treebanks`).push()
        treebank.id = treebankRef.key
        treebank.owner = user.uid
        treebankRef.set(treebank).then(() => {
            //Normalise sentences and words at eg. words/:treebankID/:sentenceID
            let sentenceUpdates = {}
            let wordUpdates = {}
            sentences.forEach( sentence => {
                const sentenceKey = database.ref(`/user/${user.uid}/sentences/${treebankRef.key}`).push().key
                sentence.words.forEach( word => {
                    const wordKey = database.ref(`/user/${user.uid}/words/${treebankRef.key}/${sentenceKey}`).push().key
                    word.id = wordKey
                    wordUpdates[`${sentenceKey}/${wordKey}`] = word
                })
                sentenceUpdates[sentenceKey] = {...sentence, id: sentenceKey, words: null}
            })
            //Batch requests
            database.ref(`/user/${user.uid}/sentences/${treebankRef.key}`).update(sentenceUpdates)
            database.ref(`/user/${user.uid}/words/${treebankRef.key}`).update(wordUpdates)
        })
    }
}

export const deleteTreebank = (id) => {
    return (dispatch, getState) => {
        const { user } = getState()
        dispatch({ type: "TREEBANK_DELETE_STARTED" })
        database.ref(`/user/${user.uid}/treebanks/${id}`).remove().then(() => {
            database.ref(`/user/${user.uid}/sentences/${id}`).remove().then(() => {
                database.ref(`/user/${user.uid}/words/${id}`).remove().then(() => {
                    dispatch({ type: "TREEBANK_DELETE_SUCCEEDED", id })
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
    return (dispatch, getState) => {
        const { user } = getState()
        dispatch({
            type: "SENTENCE_EDIT",
            treebank, sentence, data
        })
        database.ref(`/user/${user.uid}/sentences/${treebank}/${sentence}`).update(data)
    }
}

export const editWord = (treebank, sentence, word, data) => {
    return (dispatch, getState) => {
        const { user } = getState()
        dispatch({
            type: "WORD_EDIT",
            treebank, sentence, word, data
        })
        const ref = database.ref(`/user/${user.uid}/words/${treebank}/${sentence}/${word}`)
        ref.update(data)
    }
}

export const editWords = (treebank, sentence, words) => {
    return (dispatch, getState) => {
        const { user } = getState()
        let updates = {}
        words.forEach(word => updates[word.id] = word)
        dispatch({
            type: "WORDS_EDIT",
            treebank, sentence, words
        })
        const ref = database.ref(`/user/${user.uid}/words/${treebank}/${sentence}`)
        ref.set(updates)
    }
}

export const createWord = (treebank, sentence, data) => {
    return (dispatch, getState) => {
        const { user } = getState()
        dispatch({type: "WORD_CREATE_STARTED"})
        const key = database.ref(`/user/${user.uid}/words/${treebank}/${sentence}`).ref.push().key
        database.ref(`/user/${user.uid}/words/${treebank}/${sentence}/${key}`).set({
            ...data,
            id: key
        }).then(() => {
            dispatch({type: "WORD_CREATE_COMPLETED"})
        })
    }
}

export const queueExportTreebank = (treebankID) => {
    return (dispatch, getState) => {
        const { user } = getState()
        dispatch({
            type: "EXPORT_TREEBANK_STARTED",
            treebank: treebankID
        })
        database.ref(`/user/${user.uid}/treebanks/${treebankID}`).once('value', snapshot => {
            let treebank = snapshot.val()
            database.ref(`/user/${user.uid}/sentences/${treebankID}`).orderByKey().once('value', snapshot => {
                treebank.sentences = snapshot.val()
                database.ref(`/user/${user.uid}/words/${treebankID}`).orderByKey().once('value', snapshot => {
                    let wordsBySentence = snapshot.val()
                    wordsBySentence.forEach( (words, index) => {
                        treebank.sentences[index].words = words
                    })
                    const conllu = new CONLLU(treebank.name, treebank.sentences)
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

export const createRelationLabel = (label, value) => {
    return (dispatch, getState) => {
        const { user, current } = getState()
        database.ref(`/user/${user.uid}/treebanks/${current.treebank}/settings/relations/${value}`).set(label).then(() => {
            dispatch({
                type: "RELATION_LABEL_CREATED"
            })
        })
    }
}

export const createSentence = sentence => {
    return (dispatch, getState) => {
        const { user, current } = getState()
        const sentenceID = database.ref(`/user/${user.uid}/sentences/${current.treebank}`).push().key
        database.ref(`/user/${user.uid}/sentences/${current.treebank}/${sentenceID}`).set({...sentence, id: sentenceID, words: null})
        database.ref(`/user/${user.uid}/words/${current.treebank}/${sentenceID}`).set(sentence.words)
        dispatch({
            type: "SENTENCE_CREATED"
        })
    }
}
