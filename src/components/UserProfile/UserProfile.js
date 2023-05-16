import React, { useState, useEffect } from "react";
import { auth, firestore, onAuthStateChanged } from "../../api/firebase";
import { updateDoc, doc, getDoc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import styles from "./UserProfile.module.css";
//import UpdateProfile from "../UpdateProfile/UpdateProfile";

const UserProfile = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userPhone, setUserPhone] = useState("");
  const [userPincode, setUserPincode] = useState("");
  const [userLocation, setUserLocation] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const checkUserProfileData = async (user) => {
      const userDocRef = doc(firestore, "users", user.uid);
      const userDoc = await getDoc(userDocRef);
    
      if (userDoc.exists()) {
        const userProfileDocRef = doc(userDocRef, "Profile", user.uid);
        const userProfileDoc = await getDoc(userProfileDocRef);
    
        if (userProfileDoc.exists()) {
          const userProfileData = userProfileDoc.data();
          setUserPhone(userProfileData.phone);
          setUserPincode(userProfileData.pincode);
          setUserLocation(userProfileData.location);
    
          if (userProfileData.phone && userProfileData.pincode && userProfileData.location) {
            navigate("/food-preferences");
          }
        } else {
          await setDoc(userProfileDocRef, {
            phone: "",
            pincode: "",
            location: "",
          });
        }
      } else {
        await setDoc(userDocRef, {});
        const userProfileDocRef = doc(userDocRef, "Profile", user.uid);
        await setDoc(userProfileDocRef, {
          phone: "",
          pincode: "",
          location: "",
        });
      }
    };
    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
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
      const user = auth.currentUser;
  
      // Prepare the updated profile data
      const profileData = {
        phone: userPhone,
        pincode: userPincode,
        location: userLocation,
      };
  
      const updateProfileData = async (user, profileData) => {
        const userDocRef = doc(firestore, "users", user.email); // Use user's email as the document ID
        await updateDoc(userDocRef, { Profile: profileData, profile_updated: 'yes' }); // Set the profile data and profile_updated flag
        console.log("Profile data updated:", profileData);
      };
  
      // Update the profile data
      await updateProfileData(user, profileData);
  
      // Redirect or perform any other action after the update
      navigate("/food-preferences");
    } catch (error) {
      console.error("Error updating profile data:", error);
      setError("Error updating profile data. Please try again later.");
    }
  };

 // if (!currentUser || !currentUser.displayName) {
  //  return <UpdateProfile />;
 // }

  return (
    <div className={styles.userProfile}>
      <h2>Create Your Profile</h2>
      <div className={styles.userInfo}>
        {currentUser && currentUser.displayName && (
          <div className={styles.userName}>{currentUser.displayName}</div>
        )}
        {currentUser && (
          <div className={styles.userEmail}>{currentUser.email}</div>
        )}
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

