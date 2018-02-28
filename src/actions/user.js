import { auth } from "../firebaseApp"
import { addMessage, addError } from "./index.js"

export const login = (email, password) => {
    return dispatch => {
        auth.signInWithEmailAndPassword(email, password).catch(error => {
            console.error(error)
            dispatch(addError(error.message))
        })
    }
}

export const register = (email, password, displayName) => {
    return dispatch => {
        auth.createUserWithEmailAndPassword(email, password).then(user => {
            user.updateProfile({ displayName })
        }).catch(error => {
            console.error(error)
            dispatch(addError(error.message))
        })
    }
}

export const forgotPassword = (email) => {
    return dispatch => {
        auth.sendPasswordResetEmail(email).then(() => {
            addMessage(`New password sent to ${email}`)
        }).catch(error => {
            console.error(error)
            dispatch(addError(error.message))
        })
    }
}

let syncingAuth = false
export const syncAuth = () => {
    return dispatch => {
        if (!syncingAuth) auth.onAuthStateChanged(user => {
            if (user) {
                dispatch({
                    ...user,
                    type: "USER_CHANGE"
                })
            } else {
                dispatch({
                    type: "USER_LOGOUT"
                })
            }
        })
        syncingAuth = true
    }
}
