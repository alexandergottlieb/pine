import { database } from '../firebaseApp'

export const fetchTreebanks = () => {
    return dispatch => {
        const ref = database.ref('/treebanks')
        ref.on('value', snapshot => {
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
        const ref = database.ref(`/treebanks/${id}`).remove().then(() => {
            const ref = database.ref(`/sentences/${id}`).remove().then(() => {
                dispatch({ type: "DELETE_TREEBANK_SUCCEEDED", id })
            })
        })
    }
}

export const fetchSentences = id => {
    return dispatch => {
        const ref = database.ref(`/sentences/${id}`)
        ref.on('value', snapshot => {
            dispatch({
                type: "FETCH_SENTENCES_COMPLETE",
                sentences: snapshot.val()
            })
        })
    }
}
