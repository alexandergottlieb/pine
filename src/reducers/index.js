import { combineReducers } from "redux"
import user from './user'
import treebanks from './treebanks'
import sentences from './sentences'
import current from './current'
import permissions from './permissions'

const reducer = combineReducers({
    user, treebanks, sentences, current, permissions
});

export default reducer
