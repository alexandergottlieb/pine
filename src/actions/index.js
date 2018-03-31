import { database } from "../firebaseApp"
import FileSaver from "file-saver"
import Treebank from "../classes/Treebank"
import Sentence from "../classes/Sentence"

import { syncTreebank, syncSentences, syncWords } from "./sync"
export * from "./sync"
export * from "./user.js"
export * from "./sharing.js"

const firebaseError = (e, dispatch) => {
    //Separate error ID from error message
    const split = e.message.split(":")
    const message = split[1] ? split[1] : e.message
    dispatch(addError(`Error: ${message}`))
}

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
            }), 4000)
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
        dispatch({ type: "UPLOAD_TREEBANK_START" })
        const sentences = treebank.sentences
        treebank.sentences = treebank.sentences.length

        const treebankRef = database.ref(`/treebanks`).push()
        const treebankID = treebankRef.key
        treebank.id = treebankID
        let updates = {}
        //Set treebank meta
        updates[`/treebanks/${treebankID}`] = treebank
        //Set permissions
        updates[`/permissions/user/${user.uid}/treebanks/${treebankID}`] = "owner"
        updates[`/permissions/treebank/${treebankID}/users/${user.uid}`] = "owner"
        //Normalise sentences and words at eg. words/:treebankID/:sentenceID
        sentences.forEach( sentence => {
            const sentenceID = database.ref(`/sentences/${treebankID}`).push().key
            sentence.words.forEach( word => {
                const wordID = database.ref(`/words/${treebankID}/${sentenceID}`).push().key
                word.id = wordID
                updates[`/words/${treebankID}/${sentenceID}/${wordID}`] = word
            })
            updates[`/sentences/${treebankID}/${sentenceID}`] = {...sentence, id: sentenceID, words: null}
        })
        //Do all updates atomically
        database.ref().update(updates).then(() => {
            dispatch({ type: "UPLOAD_TREEBANK_COMPLETE" })
            dispatch(fetchTreebanks(user.uid))
        }).catch(e => firebaseError(e, dispatch))
    }
}

export const deleteTreebank = (treebankID) => {
    return (dispatch, getState) => {
        const { user } = getState()
        dispatch({ type: "TREEBANK_DELETE_STARTED" })
        //Asynchronously delete across the normalised database
        const updates = {}
        updates[`/treebanks/${treebankID}`] = null
        updates[`/sentences/${treebankID}`] = null
        updates[`/words/${treebankID}`] = null
        updates[`/permissions/user/${user.uid}/treebanks/${treebankID}`] = null
        updates[`/permissions/treebank/${treebankID}/users/${user.uid}`] = null
        //Once requests complete
        database.ref().update(updates).then(() => {
            dispatch({
                type: "TREEBANK_DELETE_SUCCEEDED",
                id: treebankID
            })
        }).catch(e => firebaseError(e, dispatch))
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

export const fetchTreebanks = (userID) => {
    return (dispatch) => {
        database.ref(`/permissions/user/${userID}/treebanks`).once('value', snapshot => {
            dispatch({
                type: "FETCH_TREEBANKS_START"
            })
            const treebankPermissions = snapshot.val()
            let requestPromises = []
            let treebanks = {}
            for (const treebankID in treebankPermissions) {
                requestPromises.push(database.ref(`/treebanks/${treebankID}`).once("value", snapshot => {
                    treebanks[treebankID] = snapshot.val()
                }))
            }
            Promise.all(requestPromises).then(() => {
                dispatch({
                    type: "FETCH_TREEBANKS_COMPLETE",
                    treebanks
                })
            })
        })
    }
}

export const setCurrent = (treebank, sentence = null, page = null) => {
    return dispatch => {
        if (treebank) dispatch(syncTreebank(treebank))
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
        database.ref(`/sentences/${treebank}/${sentence}`).update(data).catch(e => firebaseError(e, dispatch))
    }
}

export const editWord = (treebank, sentence, word, data) => {
    return (dispatch) => {
        dispatch({
            type: "WORD_EDIT",
            treebank, sentence, word, data
        })
        const ref = database.ref(`/words/${treebank}/${sentence}/${word}`)
        ref.update(data).catch(e => firebaseError(e, dispatch))
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
        ref.set(updates).catch(e => firebaseError(e, dispatch))
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
        }).catch(e => firebaseError(e, dispatch))
    }
}

export const createRelationLabel = (label, value) => {
    return (dispatch, getState) => {
        const { current } = getState()
        database.ref(`/treebanks/${current.treebank}/settings/relations/${value}`).set(label).then(() => {
            dispatch({
                type: "RELATION_LABEL_CREATED"
            })
        }).catch(e => firebaseError(e, dispatch))
    }
}

export const createSentence = sentence => {
    return (dispatch, getState) => {
        const { current } = getState()
        const sentenceID = database.ref(`/sentences/${current.treebank}`).push().key
        database.ref(`/sentences/${current.treebank}/${sentenceID}`).set({...sentence, id: sentenceID, words: null}).catch(e => firebaseError(e, dispatch))
        let words = {}
        sentence.words.forEach( word => {
            const wordID = database.ref(`/words/${current.treebank}/${sentenceID}`).push().key
            word.id = wordID
            words[wordID] = word
        })
        database.ref(`/words/${current.treebank}/${sentenceID}`).set(words).catch(e => firebaseError(e, dispatch))
        dispatch({
            type: "SENTENCE_CREATED"
        })
    }
}
