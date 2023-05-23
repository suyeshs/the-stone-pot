import { firestore, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

export const fetchUserProfile = async (userEmail) => {
  const userDocRef = doc(firestore, "users", userEmail);
  const userDocSnapshot = await getDoc(userDocRef);
  const userData = userDocSnapshot.data();
  return userData;
};

export const updateUserProfile = async (userEmail, profileData) => {
  const userDocRef = doc(firestore, "users", userEmail);
  await updateDoc(userDocRef, profileData);
};

export const createUserProfile = async (userEmail, profileData) => {
  const userDocRef = doc(firestore, "users", userEmail);
  await setDoc(userDocRef, profileData);
};
