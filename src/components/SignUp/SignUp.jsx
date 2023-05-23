import React, { useContext } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { getFirestore, doc, setDoc, collection, getDoc } from "firebase/firestore";
import firebaseConfig from "../../api/firebase";
import { Button } from "@mui/material";
import { FaGoogle } from "react-icons/fa";
import styles from "./SignUp.module.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

const SignUp = () => {
  const { setAuthState } = useContext(AuthContext);
  const navigate = useNavigate();

  const signUpWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await setPersistence(auth, browserSessionPersistence); // Set persistence
      await auth.signOut();
      const result = await signInWithPopup(auth, provider);
      const { email, displayName, photoURL } = result.user;

      const userDocRef = doc(collection(firestore, "users"), email);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        // User already exists, log in the user
        setAuthState({ isLoggedIn: true, userEmail: email });
        console.log("User logged in:", email);
      } else {
        // User doesn't exist, create a new user
        await setDoc(userDocRef, { displayName, email, photoURL });
        setAuthState({ isLoggedIn: true, userEmail: email });
        console.log("New user signed up:", email);
      }

      // Store authState to localStorage
      localStorage.setItem("authState", JSON.stringify({ isLoggedIn: true, userEmail: email }));

      navigate("/user-profile");
    } catch (error) {
      console.error("Error signing up with Google:", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Sign Up</h2>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FaGoogle size={20} />}
          onClick={signUpWithGoogle}
          className={styles.button}
        >
          Sign Up with Google
        </Button>
      </div>
    </div>
  );
};

export default SignUp;