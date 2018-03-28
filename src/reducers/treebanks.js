import Treebank from "../classes/Treebank"

const treebanks = (state = {}, action) => {
    switch (action.type) {
        case "TREEBANKS_UPDATED":
            let treebanks = {}
            for (let id in action.treebanks) {
                treebanks[id] = new Treebank(action.treebanks[id])
            }
            return {...treebanks}
        case "TREEBANK_DELETE_SUCCEEDED":
            let newState = Object.assign({}, state)
            delete newState[action.id]
            return newState
        default:
            return state
    }
}

export default treebanks
