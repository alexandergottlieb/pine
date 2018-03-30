import { database } from "../firebaseApp"
import { addError, addMessage } from "./index.js"

export const fetchPermissions = (treebankID) => {
    return (dispatch) => {
        dispatch({
            type: "PERMISSIONS_FETCH_START",
            treebank: treebankID
        })
        //Get users with permissions on the current treebank
        database.ref(`/permissions/treebank/${treebankID}/users`).once("value", snapshot => {
            //Fetch individual user data asynchronously
            const permissions = snapshot.val()
            let userPromises = []
            let users = []
            for (const uid in permissions) {
                userPromises.push(database.ref(`/users/${uid}`).once("value", snapshot => {
                    let user = snapshot.val()
                    users.push({...user, uid, role: permissions[uid]})
                }))
            }
            //Once requests complete
            Promise.all(userPromises).then(() => {
                dispatch({
                    type: "PERMISSIONS_FETCH_COMPLETE",
                    permissions: users
                })
            })
        })
    }
}

export const shareTreebank = (treebank, email, role = "viewer") => {
    return (dispatch) => {
        dispatch({type: "PERMISSIONS_SHARE_START"})
        database.ref("/users").orderByChild("email").equalTo(email).once("value", snapshot => {
            try {
                const matches = snapshot.val()
                //Check we have a match
                if (!matches) throw new Error(`Could not share with ${email} as they do not have an account.`)

                //Only one user should match the email
                let matchingUsers = []
                for (const uid in matches) {
                    matchingUsers.push({...matches[uid], uid})
                }
                if (matchingUsers.length > 1) throw new Error(`Treebanks cannot currently be shared with ${email}.`)
                const user = matchingUsers.pop()

                //Update permissions
                let requests = []
                //Add user to treebank
                requests.push(database.ref(`/permissions/user/${user.uid}/treebanks/${treebank.id}`).set(role))
                //Add treebank to user
                requests.push(database.ref(`/permissions/treebank/${treebank.id}/users/${user.uid}`).set(role))
                Promise.all(requests).then(() => {
                    dispatch(addMessage(`Treebank '${treebank.name}' is now being shared with ${email}.`))
                    dispatch({
                        type: "PERMISSIONS_SHARE_COMPLETE",
                        user: { ...user, role }
                    })
                })
            } catch (e) {
                dispatch(addError(e.message))
            }
        })
    }
}

export const removePermissions = (treebank, user) => {
    return (dispatch) => {
        let requests = []
        //Add user to treebank
        requests.push(database.ref(`/permissions/user/${user.uid}/treebanks/${treebank.id}`).remove())
        //Add treebank to user
        requests.push(database.ref(`/permissions/treebank/${treebank.id}/users/${user.uid}`).remove())
        Promise.all(requests).then(() => {
            dispatch(addMessage(`${user.email} is no longer sharing '${treebank.name}'.`))
            dispatch({
                type: "PERMISSIONS_REMOVE_COMPLETE",
                user
            })
        })
    }
}
