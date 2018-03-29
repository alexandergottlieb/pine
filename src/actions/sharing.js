import { database } from "../firebaseApp"
import { addError, addMessage } from "./index.js"

export const fetchSharingUsers = () => {
    return (dispatch, getState) => {
        const { current } = getState()
        const { treebank } = current
        dispatch({
            type: "SHARING_USERS_FETCH_START",
            treebank
        })
        //Get users with permissions on the current treebank
        database.ref(`/permissions/treebank/${treebank.id}/users`).once("value", snapshot => {
            //Fetch individual user data asynchronously
            const userPermissions = snapshot.val()
            let fetched = []
            const userPromises = Object.keys(userPermissions).map(uid => {
                return database.ref(`/users/${uid}`).once("value", snapshot => {
                    let user = snapshot.val()
                    fetched.push({...user, uid})
                })
            })
            //Once requests complete
            Promise.all(userPromises).then(() => {
                dispatch({
                    type: "SHARING_USERS_FETCH_COMPLETE",
                    users: fetched
                })
            })
        })
    }
}

export const shareTreebank = (treebank, email) => {
    return (dispatch, getState) => {
        const { user, current } = getState()
        dispatch({type: "SHARE_TREEBANK_START"})
        database.ref("/users").orderByChild("email").equalTo(email).once("value", snapshot => {
            try {
                const matches = snapshot.val()
                //Check we have a match
                if (!matches) throw new Error(`Could not share with ${email} as they do not have an account.`)

                //Only one user should match the email
                let users = []
                for (const uid in matches) {
                    users.push({...matches[uid], uid})
                }
                if (users.length > 1) throw new Error(`Treebanks cannot currently be shared with ${email}.`)
                const shareUser = users.pop()

                //Add user to treebank
                database.ref(`/permissions/${shareUser.uid}/treebanks/${treebank.id}`).set(true).then(() => {
                    //Add treebank to user's collection
                    database.ref(`/users/${shareUser.uid}/sharedTreebanks/${treebank.id}`).set("shared").then(() => {
                        addMessage(`Treebank '${treebank.name}' is now being shared with ${email}.`)
                        dispatch({
                            type: "SHARE_TREEBANK_COMPLETE",
                            shareUser
                        })
                    }).catch(e => {
                        console.error(e)
                        addError(`Could not share with ${email}, please try again later.`)
                    })
                }).catch(e => {
                    console.error(e)
                    addError(`Could not share with ${email}, please try again later.`)
                })
            } catch (e) {
                addError(e.message)
            }
        })
    }
}
