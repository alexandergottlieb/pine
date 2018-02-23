import { combineReducers } from "redux"
import user from './user'
import treebanks from './treebanks'
import sentences from './sentences'
import words from './words'
import current from './current'

const reducer = combineReducers({
    user, treebanks, sentences, words, current
});

export default reducer
