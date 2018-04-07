import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import reducer from "./reducers"
import { database, firebaseError } from "./firebaseApp"

const logger = store => next => action => {
  console.log('dispatching', action)
  let result = next(action)
  console.log('next state', store.getState())
  return result
}

const middleware = process.env.NODE_ENV !== 'production'
    ? applyMiddleware(thunk, logger)
    : applyMiddleware(thunk)

const store = createStore(reducer, middleware);

//Sync sentence edits with firebase
let lastEdited = null
let id = null
store.subscribe(() => {
  const state = store.getState()
  const treebank = state.current.treebank
  const sentence = state.sentence.present

  if (id !== sentence.id) {
    id = sentence.id
    lastEdited = sentence.lastEdited
  }

  if (sentence.lastEdited !== lastEdited) {
    let updates = {}
    updates[`/words/${treebank}/${sentence.id}`] = sentence.words
    updates[`/sentences/${treebank}/${sentence.id}`] = {...sentence, words: null}
    database.ref().update(updates).then(() => {
      store.dispatch({type: "SENTENCE_SAVED"})
    }).catch(e => firebaseError(e, store.dispatch))
    lastEdited = sentence.lastEdited
  }
})

export default store
