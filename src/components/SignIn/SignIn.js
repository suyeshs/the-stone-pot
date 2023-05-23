import React, { useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import firebaseConfig from "../../api/firebase";
import { Button } from "@mui/material";
import { FaGoogle } from "react-icons/fa";
import styles from "./SignIn.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const SignIn = () => {
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserSessionPersistence); // Set persistence
      await auth.signOut();
      const result = await signInWithPopup(auth, provider);
      const { email, displayName, photoURL } = result.user;
      const userDocRef = doc(collection(firestore, "users"), email);
      await setDoc(userDocRef, { displayName, email, photoURL });
      setAuthState({ isLoggedIn: true, userEmail: email });
      navigate("/user-profile", {
        state: { authState: true, setAuthState: email },
      });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Sign In</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaGoogle size={20} />}
          onClick={signInWithGoogle}
          className={styles.button}
        >
          Sign In with Google
        </Button>
      </div>
    </div>
  );
};

export default SignIn;
