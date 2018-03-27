const initial = {
    loggedIn: false
}

const user = (state = initial, action) => {
    switch (action.type) {
        case "USER_LOGOUT": {
            return initial
        }
        case "USER_CHANGE": {
            const { user } = action
            let newState = { ...state, ...user, loggedIn: true}
            //Do not overwrite recent profile changes
            if (!user.displayName) newState.displayName = state.displayName
            if (!user.photoURL) newState.photoURL = state.photoURL
            return newState
        }
        case "USER_PROFILE_UPDATED": {
            return { ...state, ...action.user }
        }
        default:
            return state
    }
}

export default user
