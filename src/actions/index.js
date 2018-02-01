import { database } from '../firebaseApp'

export const fetchTreebanks = () => {
    return dispatch => {
        const ref = database.ref('/treebanks')
        ref.once('value', snapshot => {
            dispatch({
                type: "FETCH_TREEBANKS_COMPLETE",
                treebanks: snapshot.val()
            })
        })
    }
}

export const uploadTreebank = treebank => {
    return dispatch => {
        dispatch({ type: "UPLOAD_TREEBANK_STARTED" })
        const sentences = treebank.sentences
        treebank.sentences = treebank.sentences.length

        const treebankRef = database.ref('/treebanks').push()
        treebank.id = treebankRef.key
        treebankRef.set(treebank).then(() => {
            const sentencesRef = database.ref(`/sentences/${treebankRef.key}`)
            sentencesRef.set(sentences).then(() => {
                dispatch({ type: "UPLOAD_TREEBANK_SUCCEEDED" })
            }).catch((error) => {
                console.log(error)
                dispatch({ type: "UPLOAD_TREEBANK_FAILED" })
            })
        }).catch((error) => {
            console.log(error)
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
        const ref = database.ref(`/sentences/${treebankID}`).orderByKey()
        ref.once('value', snapshot => {
            dispatch({
                type: "UPDATE_CURRENT_SENTENCES",
                sentences: snapshot.val()
            })
        })
    }
}

export const setWord = (id = null) => {
    return {
        type: "SET_CURRENT_WORD",
        id
    }
}

export const setRelation = (id = null) => {
    return {
        type: "SET_CURRENT_RELATION",
        id
    }
}
