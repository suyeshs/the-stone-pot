import React, { createContext, useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged , authState} from 'firebase/auth';
import { auth } from './api/firebase';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authState, setAuthState] = useState(() => {
      const storedAuthState = localStorage.getItem('authState');
      return storedAuthState ? JSON.parse(storedAuthState) : { isLoggedIn: false, userEmail: '' };
    });
  
    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          // User is signed in
          const newAuthState = { isLoggedIn: true, userEmail: user.email };
          setAuthState(newAuthState);
          localStorage.setItem('authState', JSON.stringify(newAuthState));
          console.log('Updated authState:', newAuthState);
          console.log('Updated localStorage:', localStorage.getItem('authState'));
        } else {
          // User is signed out
          const newAuthState = { isLoggedIn: false, userEmail: '' };
          setAuthState(newAuthState);
          localStorage.setItem('authState', JSON.stringify(newAuthState));
          console.log('Updated authState:', newAuthState);
          console.log('Updated localStorage:', localStorage.getItem('authState'));
        }
      });
  
      return () => {
        // Unsubscribe the listener when the component is unmounted
        unsubscribe();
      };
    }, []);
  
    return (
      <AuthContext.Provider value={{ authState, setAuthState }}>
        {children}
      </AuthContext.Provider>
    );
  };
  