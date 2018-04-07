import firebase from 'firebase'
import store from "./store"
import { addError } from "./actions"

let config = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID
}
firebase.initializeApp(config);

export const database = firebase.database()

export const auth = firebase.auth()

export const firebaseError = (e, dispatch) => {
    //Separate error ID from error message
    const split = e.message.split(":")
    const message = split[1] ? split[1] : e.message
    dispatch(addError(`Error: ${message}`))
}
