import React, { useState, useEffect } from 'react';
import { collection, doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, firestore } from '../../api/firebase'; 

const UpdateProfile = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      } else {
        setUser(null);
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(collection(firestore, 'users'), user.uid);
      getDoc(userDocRef)
        .then((docSnapshot) => {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            setDisplayName(data.displayName || '');
            setEmail(data.email || '');
            setPhotoURL(data.photoURL || '');
            
          }
        })
        .catch((error) => {
          console.error('Error fetching profile data:', error);
        });
    }
  }, [user]);

  if (!user) {
    return <div>Please log in</div>
  }

  const handleUpdate = () => {
    const userDocRef = doc(collection(firestore, 'users'), user.uid);
    updateDoc(userDocRef, {
      displayName,
      email,
      photoURL,
      
    });
  }

  return (
    <div>
      <h1>Update Profile</h1>
      <input
        type="text"
        placeholder="Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <input
        type="text"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="text"
        placeholder="Photo URL"
        value={photoURL}
        onChange={(e) => setPhotoURL(e.target.value)}
      />
     
      <button onClick={handleUpdate}>
        Update Profile
      </button>
    </div>
  )
}

export default UpdateProfile;
