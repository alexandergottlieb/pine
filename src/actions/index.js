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
        const ref = database.ref('/treebanks').push(treebank)
        ref.set(treebank).then(() => {
            dispatch({ type: "UPLOAD_TREEBANK_SUCCEEDED" })
        }).catch(() => {
            dispatch({ type: "UPLOAD_TREEBANK_FAILED" })
        })
    }
}
