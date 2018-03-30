const initial = []

const permissions = (state = initial, action) => {
    switch (action.type) {
        case "PERMISSIONS_FETCH_COMPLETE": {
            return action.permissions.map(user => user)
        }
        case "PERMISSIONS_SHARE_COMPLETE": {
            let newState = state.map(user => user)
            newState.push(action.user)
            return newState
        }
        case "PERMISSIONS_REMOVE_COMPLETE": {
            return state.filter(user => user.uid !== action.user.uid)
        }
        case "USER_LOGOUT": {
            return initial
        }
        default: {
            return state
        }
    }
}

export default permissions
