import { database } from "../firebaseApp"
import FileSaver from "file-saver"
import CONLLU from "../classes/CONLLU"

//Track listeners on firebase endpoints to aviod duplication
let watchers = []

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
            const sentencesRef = database.ref(`/sentences/${treebankRef.key}`)
            sentencesRef.set(sentences)
        }).catch((error) => {
            console.error(error)
            dispatch({ type: "UPLOAD_TREEBANK_FAILED" })
        })
    }
}

export const deleteTreebank = id => {
    return dispatch => {
        dispatch({ type: "DELETE_TREEBANK_STARTED" })
        database.ref(`/treebanks/${id}`).remove().then(() => {
            database.ref(`/sentences/${id}`).remove().then(() => {
                dispatch({ type: "DELETE_TREEBANK_SUCCEEDED", id })
            })
        })
    }
}

export const fetchSentences = (treebankID) => {
    return dispatch => {
        const ref = database.ref(`/sentences/${treebankID}`).orderByKey()
        ref.once("value", snapshot => {
            dispatch({
                type: "FETCHED_SENTENCES",
                treebank: treebankID,
                sentences: snapshot.val()
            })
        })
    }
}

export const setCurrent = (treebankID, sentenceID) => {
    return dispatch => {
        dispatch({
            type: "SET_CURRENT_TREEBANK",
            id: treebankID
        })
        dispatch({
            type: "SET_CURRENT_SENTENCE",
            id: sentenceID
        })
        dispatch(fetchSentences(treebankID))
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
            type: "EDIT_WORD",
            treebank, sentence, word, data
        })
        const ref = database.ref(`/sentences/${treebank}/${sentence}/words/${word}`)
        ref.update(data)
    }
}

export const editSentence = (treebank, sentence, data) => {
    return dispatch => {
        dispatch({
            type: "EDIT_SENTENCE",
            treebank, sentence, data
        })
        const ref = database.ref(`/sentences/${treebank}/${sentence}`)
        console.log('incoming', data)
        ref.update(data)
    }
}

export const queueExportTreebank = (treebankID) => {
    return dispatch => {
        dispatch({
            type: "EXPORT_TREEBANK_STARTED",
            treebank: treebankID
        })
        dispatch(fetchSentences(treebankID))
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
