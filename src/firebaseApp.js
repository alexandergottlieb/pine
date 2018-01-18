import firebase from 'firebase'

let config = {
    apiKey: "AIzaSyBGZ-Fo_AE5LCrB_X_UdKyuX-c02Ho4f1I",
    authDomain: "alexandergottlieb-treebanker.firebaseapp.com",
    databaseURL: "https://alexandergottlieb-treebanker.firebaseio.com",
    projectId: "alexandergottlieb-treebanker",
    storageBucket: "alexandergottlieb-treebanker.appspot.com",
    messagingSenderId: "329633382744"
}
firebase.initializeApp(config);

export const database = firebase.database()
