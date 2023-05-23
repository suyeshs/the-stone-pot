import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, arrayUnion } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA0jyPauQo1DEdqQe1MJRn856JsrtLDeZI",
  authDomain: "recipes-5e9b9.firebaseapp.com",
  projectId: "recipes-5e9b9",
  storageBucket: "recipes-5e9b9.appspot.com",
  messagingSenderId: "675082548913",
  appId: "1:675082548913:web:493fc4b896eaf1ea6c9490",
};

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const firestore = getFirestore(firebaseApp);
const FieldValue = {
  arrayUnion,
};

const actionCodeSettings = {
  url: "http://localhost:3000/signup",
  handleCodeInApp: true,
  dynamicLinkDomain: "http://localhost:3000/user-profile",
};

export {
  auth,
  firestore,
  FieldValue,
  actionCodeSettings,
  onAuthStateChanged,
  firebaseApp,
};

export default firebaseConfig;