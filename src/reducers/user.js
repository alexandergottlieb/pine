const initial = {
    loggedIn: false
}

const user = (state = initial, action) => {
    switch (action.type) {
        case "USER_LOGOUT": {
            return initial
        }
        default:
            return state
    }
}

export default user
