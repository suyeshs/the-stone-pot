import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = ({ username, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuOpen = () => {
    setIsMenuOpen(true);
  };

  const handleMenuClose = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className={styles.header}>
      <div className={styles.logoContainer}>
        <Link to="/">
          <img src="/stone-pot-logo.png" alt="Logo" className={styles.logo} />
        </Link>
      </div>
      <nav className={`${styles.nav} ${isMenuOpen ? styles.navOpen : ""}`}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/">Home</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/find-dishes">Find Dishes</Link>
          </li>
          <li className={styles.navItem}>
            <Link to="/update-profile">Update Profile</Link>
          </li>
        </ul>
        <button className={styles.closeButton} onClick={handleMenuClose}>
          <FaTimes size={24} />
        </button>
      </nav>
      <div className={styles.userContainer}>
        {username && (
          <>
            <span className={styles.username}>Welcome, {username}</span>
            <button className={styles.logoutButton} onClick={onLogout}>
              Logout
            </button>
          </>
        )}
      </div>
      <button className={styles.menuButton} onClick={handleMenuOpen}>
        <FaBars size={24} />
      </button>
    </header>
  );
};

export default Header;
