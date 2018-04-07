import { createStore, applyMiddleware } from "redux"
import thunk from "redux-thunk"
import reducer from "./reducers"
import debounce from "debounce"
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
const syncSentence = debounce((treebank, sentence) => {
  let updates = {}
  updates[`/words/${treebank}/${sentence.id}`] = sentence.words
  updates[`/sentences/${treebank}/${sentence.id}`] = {...sentence, words: null}
  database.ref().update(updates).catch(e => firebaseError(e, store.dispatch))
}, 500)
store.subscribe(() => {
  const state = store.getState()
  const { treebank, undoing } = state.current
  const sentence = state.sentence.present

  if (!sentence) return
  //If sentence changed, reset
  if (id !== sentence.id) {
    id = sentence.id
    lastEdited = sentence.lastEdited
  }
  if (sentence.lastEdited > lastEdited || undoing) {
    lastEdited = sentence.lastEdited
    store.dispatch({type: "SENTENCE_EDIT_UPDATED"})
    syncSentence(treebank+'', sentence)
  }
})

export default store
