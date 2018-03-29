import { auth, database } from "../firebaseApp"
import { addMessage, addError, fetchTreebanks } from "./index.js"

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
            user.updateProfile({ displayName }).then(
                dispatch({
                    type: "USER_PROFILE_UPDATED",
                    user: {
                        displayName
                    }
                })
            )
            //Store in database for lookup by other users
            database.ref(`/users/${user.uid}`).set({email, displayName})
        }).catch(error => {
            console.error(error)
            dispatch(addError(error.message))
        })
    }
}

export const forgotPassword = (email) => {
    return dispatch => {
        auth.sendPasswordResetEmail(email).then(() => {
            dispatch(addMessage(`New password sent to ${email}`))
        }).catch(error => {
            console.error(error)
            dispatch(addError(error.message))
        })
    }
}

export const logout = () => {
    return dispatch => {
        auth.signOut().catch(e => {
            console.error(e)
        })
    }
}

let syncingAuth = false
export const syncAuth = () => {
    return dispatch => {
        if (!syncingAuth) auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, email, uid, photoURL, emailVerified, isAnonymous } = user
                fetchTreebanks(uid)
                dispatch({
                    user: {
                        displayName, email, uid, photoURL, emailVerified, isAnonymous
                    },
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
