import React, { useState, useEffect } from "react";
import { auth, firestore, onAuthStateChanged } from "../../api/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from "./UserProfile.module.css";

const UserProfile = () => {
  const currentUser = auth.currentUser;

  const [userPhone, setUserPhone] = useState("");
  const [userPincode, setUserPincode] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserProfileData = async (user) => {
      const userRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userRef);

      if (userDoc.exists()) {
        const userData = userDoc.data();
        setUserPhone(userData.phone);
        setUserPincode(userData.pincode);
        setUserLocation(userData.location);
        navigate("/food-preferences");
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        checkUserProfileData(user);
      }
    });

    return () => {
      unsubscribe();
    };
  }, [navigate]);

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
      const userRef = doc(firestore, "users", currentUser.uid);
      await updateDoc(userRef, {
        phone: userPhone,
        pincode: userPincode,
        location: userLocation,
      });
      console.log("Document updated with ID: ", currentUser.uid);
      navigate("/food-preferences");
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  return (
    <div className={styles.userProfile}>
      <h2>Create Your Profile</h2>
      <div className={styles.userInfo}>
        <div className={styles.userName}>{currentUser.displayName}</div>
        <div className={styles.userEmail}>{currentUser.email}</div>
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
