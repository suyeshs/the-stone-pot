// src/api/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, arrayUnion} from "firebase/firestore";
import { onAuthStateChanged as authStateChanged } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyA0jyPauQo1DEdqQe1MJRn856JsrtLDeZI",
  authDomain: "recipes-5e9b9.firebaseapp.com",
  projectId: "recipes-5e9b9",
  storageBucket: "recipes-5e9b9.appspot.com",
  messagingSenderId: "675082548913",
  appId: "1:675082548913:web:493fc4b896eaf1ea6c9490",
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);
export const FieldValue = {
  arrayUnion,
};
export { authStateChanged as onAuthStateChanged };

export const actionCodeSettings = {
  url: "http://localhost:3000/signup",
  handleCodeInApp: true,
  dynamicLinkDomain: "http://localhost:3000/user-profile", // Optional, if using Firebase Dynamic Links
};

export {firebaseApp};
