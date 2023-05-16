import React, { useEffect } from "react";
import { auth } from "../../api/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styles from "./SignUp.module.css";
import { FaGoogle } from "react-icons/fa";

const SignUp = () => {
  const navigate = useNavigate();

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      navigate("/user-profile", { state: { uid: result.user.uid } });
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
