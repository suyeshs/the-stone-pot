import React, { useEffect, useCallback } from "react";
import { auth } from "../../api/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import { FaGoogle } from "react-icons/fa";

const SignUp = () => {
  const navigate = useNavigate();
  //const [email, setEmail] = useState("");
  const db = getFirestore();

  const storeUserData = useCallback(async (user) => {
    console.log("Storing user data:", user);
    const userDocRef = doc(db, "users", user.email);
    const profileColRef = collection(userDocRef, "profile");
  
    const profileData = {
      name: user.displayName,
      email: user.email,
      photoURL: user.photoURL,
      // Add more profile data fields as needed
    };
  
    await setDoc(userDocRef, {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    });
    await setDoc(profileColRef, profileData);
  }, [db]);
  
  
  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      await storeUserData(result.user);
      navigate("/user-profile", { state: { user: result.user } });
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/food-preferences");
      }
    });

    return unsubscribe;
  }, [navigate]);

  return (
    <div className={`${styles.container}`}>
      <div className={styles.formContainer}>
        <h2 className={styles.title}>Sign Up</h2>
        <button className={styles.button} onClick={signInWithGoogle}>
          <FaGoogle size={20} style={{ marginRight: "0.5rem" }} />
          Sign Up with Google
        </button>
      </div>
    </div>
  );
};

export default SignUp;
