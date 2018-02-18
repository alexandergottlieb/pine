import { combineReducers } from "redux"
import user from './user'
import treebanks from './treebanks'
import sentences from './sentences'
import current from './current'

const reducer = combineReducers({
    user, treebanks, sentences, current
});

export default reducer
