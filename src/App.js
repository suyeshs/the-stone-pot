import React, { useState} from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SignUp from "./components/SignUp/SignUp";
import UserProfile from "./components/UserProfile/UserProfile";
import styles from "./App.module.css";
import Header from "./components/Header/Header";
import FindDishes from "./components/FindDishes/FindDishes";
import FoodPreferences from "./components/FoodPreferences/FoodPreferences";
import Login from "./components/LogIn/LogIn";
import UpdateProfile from "./components/UpdateProfile/UpdateProfile";


const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setUserEmail] = useState("");



  console.log("isLoggedIn:", isLoggedIn);
  console.log("email:", email);

  const handleLogin = (email) => {
    setIsLoggedIn(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
  };

  return (
    <div className={styles.app}>
      <Router basename={process.env.PUBLIC_URL}>
        <Header username={isLoggedIn ? email : null} onLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<SignUp onLogin={handleLogin} />} />
          <Route path="/user-profile" element={<UserProfile />} />
          <Route path="/food-preferences" element={<FoodPreferences />} />
          <Route path="/find-dishes" element={<FindDishes />} />
          <Route path="/update-profile" element={<UpdateProfile />} />
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
