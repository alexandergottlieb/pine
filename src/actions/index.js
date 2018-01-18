import { database } from '../firebaseApp'

export const fetchTreebank = id => {
    //TODO - Firebase
    return {
        type: "FETCH_TREEBANK"
    }
}

export const uploadTreebank = treebank => {
    return {
        type: "UPLOAD_TREEBANK",
        payload: null //TODO
    }
}

export const setTreebank = treebank => {
    return {
        type: "SET_TREEBANK",
        treebank
    }
}

export const setSentence = sentence => {
    return {
        type: "SET_SENTENCE",
        sentence
    }
}
