import { database } from "../firebaseApp"
import FileSaver from "file-saver"
import CONLLU from "../classes/CONLLU"

import { syncTreebanks, syncSentences, syncWords } from "./sync"
export * from "./sync"

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
        dispatch({ type: "TREEBANK_DELETE_STARTED" })
        database.ref(`/treebanks/${id}`).remove().then(() => {
            database.ref(`/sentences/${id}`).remove().then(() => {
                database.ref(`/words/${id}`).remove().then(() => {
                    dispatch({ type: "TREEBANK_DELETE_SUCCEEDED", id })
                })
            })
        })
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
        database.ref(`/treebanks/${treebankID}`).once('value', snapshot => {
            let treebank = snapshot.val()
            database.ref(`/sentences/${treebankID}`).orderByKey().once('value', snapshot => {
                treebank.sentences = snapshot.val()
                database.ref(`/words/${treebankID}`).orderByKey().once('value', snapshot => {
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
