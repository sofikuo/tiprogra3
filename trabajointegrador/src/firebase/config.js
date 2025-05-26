import app from "firebase/app"
import firebase from "firebase"

const firebaseConfig = {
    apiKey: "AIzaSyBZYg3krrvAYbAkDDURns3vIIOgyDU-2xY",
    authDomain: "trabajointegradorprogra3.firebaseapp.com",
    projectId: "trabajointegradorprogra3",
    storageBucket: "trabajointegradorprogra3.firebasestorage.app",
    messagingSenderId: "596060530758",
    appId: "1:596060530758:web:411dcf91c4e034ce2c8247"
  };

  app.initializeApp(firebaseConfig)

  export const auth = firebase.auth()
  export const storiage = app.storage()
  export const db = app.firestore()
