import Treebank from "../classes/Treebank"

const initial = {}

const treebanks = (state = initial, action) => {
    switch (action.type) {
        case "FETCH_TREEBANKS_START": {
            return initial
        }
        case "FETCH_TREEBANKS_COMPLETE": {
            let treebanks = {}
            for (let id in action.treebanks) {
                treebanks[id] = new Treebank(action.treebanks[id])
            }
            return treebanks
        }
        case "TREEBANK__SYNC_UPDATE": {
            const { treebank } = action
            let newState = {...state}
            newState[treebank.id] = treebank
            return newState
        }
        case "TREEBANK_DELETE_SUCCEEDED": {
            let newState = {...state}
            delete newState[action.id]
            return newState
        }
        case "USER_LOGOUT": {
            return initial
        }
        default:
            return state
    }
}

export default treebanks
