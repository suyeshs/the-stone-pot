import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SignUp, Navbar, HomePage, UserProfile, FoodPreferences, MultiPartForm, SignIn } from './components';
import { AuthContext } from './AuthContext';
import styles from './App.module.css';
import { setPersistence, browserSessionPersistence } from 'firebase/auth';
import { auth } from './api/firebase'; // Your Firebase Auth instance

const App = () => {
  // Move the auth state logic into a single state object
  const [authState, setAuthState] = React.useState({
    isLoggedIn: false,
    userEmail: ''
  });

  useEffect(() => {
    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        console.log('Session persistence set successfully');
      })
      .catch((error) => {
        console.error('Error setting session persistence:', error);
      });
  }, []);

  useEffect(() => {
    const storedAuthState = localStorage.getItem('authState');
    if (storedAuthState) {
      const parsedAuthState = JSON.parse(storedAuthState);
      setAuthState(parsedAuthState);
    }
  }, []);

  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem('authState', JSON.stringify(authState));
      console.log('Local storage updated:', authState);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [authState]);

  const handleLogin = (email) => {
    setAuthState({ isLoggedIn: true, userEmail: email });
    console.log('User logged in:', email);
  };

  const handleLogout = () => {
    setAuthState({ isLoggedIn: false, userEmail: '' });
    console.log('User logged out');
  };

  return (
    <div className={styles.app}>
      {/* Provide the AuthContext to all child components */}
      <AuthContext.Provider value={{ authState, setAuthState, handleLogin, handleLogout }}>
        <Router basename={process.env.PUBLIC_URL}>
          <Navbar isLoggedIn={authState.isLoggedIn} userEmail={authState.userEmail} onLogout={handleLogout} />

          <Routes>
            <Route
              path="/"
              element={authState.isLoggedIn ? <UserProfile email={authState.userEmail} /> : <HomePage onLogin={handleLogin} />}
            />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/user-profile" element={<UserProfile />} />
            <Route path="/multipart-form" element={<MultiPartForm />} />
            <Route
              path="/food-preferences"
              element={<FoodPreferences isLoggedIn={authState.isLoggedIn} userEmail={authState.userEmail} />}
            />
          </Routes>
        </Router>
      </AuthContext.Provider>
    </div>
  );
};

export default App;
