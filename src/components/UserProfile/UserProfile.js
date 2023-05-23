import React, { useState, useEffect, useContext } from "react";
import { firestore } from "../../api/firebase";
import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import styles from "./UserProfile.module.css";
import { AuthContext } from "../../AuthContext";

const UserProfile = () => {
  const { authState } = useContext(AuthContext);
  const [userPhone, setUserPhone] = useState("");
  const [userPincode, setUserPincode] = useState("");
  const [userLocation, setUserLocation] = useState("");

  useEffect(() => {
    const checkUserProfileData = async () => {
      const storedAuthState = JSON.parse(localStorage.getItem("authState"));
      if (!storedAuthState || !storedAuthState.userEmail) {
      
        return;
      }

      console.log("User Profile Email:", storedAuthState.userEmail); // Check the user email value
      const userEmail = storedAuthState && storedAuthState.userEmail;
        if (!userEmail) {
        console.error("User email not found");
         return;
          }
      const userRef = doc(firestore, "users", userEmail);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        console.log("User Data:", userData); // Check the retrieved user data
        setUserPhone(userData.phone || '');
        setUserPincode(userData.pincode || '');
        setUserLocation(userData.location || '');

      } else {
        console.log("User document does not exist");
        // If the user document doesn't exist, create it with default values
        await setDoc(userRef, {
          phone: "",
          pincode: "",
          location: "",
        });
      }
    };

    if (authState.isLoggedIn) {
      checkUserProfileData();
    }
  }, [authState]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case "userPhone":
        setUserPhone(value);
        break;
      case "userPincode":
        setUserPincode(value);
        break;
      case "userLocation":
        setUserLocation(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const storedAuthState = JSON.parse(localStorage.getItem("authState"));
      const userRef = doc(firestore, "users", storedAuthState.userEmail); // Updated document reference
      const userDoc = await getDoc(userRef);
      console.log("User Document:", userDoc); // Check the user document
  
      if (userDoc.exists()) {
        await updateDoc(userRef, {
          phone: userPhone,
          pincode: userPincode,
          location: userLocation,
        });
        console.log("Document updated with ID:", storedAuthState.userEmail); // Updated log statement
      } else {
        throw new Error("Document does not exist");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };
  

  return (
    <div className={styles.userProfile}>
      <h2>Create Your Profile</h2>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{authState.userEmail}</div>
        <div className={styles.userEmail}>{authState.userEmail}</div>
      </div>
      <form onSubmit={handleSubmit}>
      <input
          type="tel"
          name="userPhone"
          value={userPhone}
          onChange={handleChange}
          placeholder="Phone Number"
          required
        />
        <br />
        <input
          type="text"
          name="userPincode"
          value={userPincode}
          onChange={handleChange}
          placeholder="Pincode"
          required
        />
        <br />
        <input
          type="text"
          name="userLocation"
          value={userLocation}
          onChange={handleChange}
          placeholder="Location"
          required
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default UserProfile;
