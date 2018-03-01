const initial = {
    loggedIn: false
}

const user = (state = initial, action) => {
    switch (action.type) {
        case "USER_LOGOUT": {
            return initial
        }
        case "USER_CHANGE": {
            return {...state, ...action.user}
        }
        default:
            return state
    }
}

export default user
