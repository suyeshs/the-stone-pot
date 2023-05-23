import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri';
import logo from '../../assets/thestonepot-logo.png';
import styles from './Navbar.module.css';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import SignUp from '../SignUp/SignUp';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';
import { AuthContext } from '../../AuthContext'; // Ensure the path is correct

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'var(--color-biscotti-beige)',
  boxShadow: 24,
  p: 4,
};

const Navbar = () => {
  const [toggleMenu, setToggleMenu] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [navLinks, setNavLinks] = useState([]); // New state to hold nav links

  const { authState } = useContext(AuthContext);
  console.log(authState); // Add this line for debugging
  const isLoggedIn = authState.isLoggedIn;
  const userEmail = authState.userEmail;

  useEffect(() => {
    
    if (isLoggedIn) {
      setNavLinks([
        { name: 'Update Profile', path: '/update-profile' },
        { name: 'User Profile', path: '/user-profile' },
        { name: 'Food Preferences', path: '/food-preferences' }// More logged-in links here...
      ]);
    } else {
      setNavLinks([
        { name: 'SignUp', path: '/sign-up' },
      // More logged-out links here...
      ]);
    }
  }, [isLoggedIn, authState]);

 
  const handleSignOut = () => {
    authState.setAuthState({
      isLoggedIn: false,
      user: null
    }); 
  };
  const navbarClass = isLoggedIn ? styles['tsp__navbar-logged-in'] : styles['tsp__navbar-logged-out'];
  
    return (
      <div className={navbarClass}>
        <div className={styles['tsp__navbar-links']}>
          <div className={styles['tsp__navbar-logo']}>
            <img src={logo} alt="Logo" />
          </div>
          <div className={styles['tsp__navbar-links_container']}>
            {navLinks.map((link, index) => (
              <p key={index}>
                <Link to={link.path}>{link.name}</Link>
              </p>
            ))}
          </div>
        </div>
        <div className={styles['tsp__navbar-links_sign']}>
          {isLoggedIn ? ( // If user is logged in
            <>
              <p>Welcome, {userEmail}!</p>
              <button type="button" onClick={handleSignOut}>Sign out</button>
            </>
          ) : (
            <>
              <button type="button" onClick={() => setModalOpen(true)}>Sign in</button>
            </>
          )}
        </div>
      <div className={styles['tsp__navbar-menu']}>
        {toggleMenu
          ? <RiCloseLine color="#fff" size={27} onClick={() => setToggleMenu(false)} />
          : <RiMenu3Line color="#fff" size={27} onClick={() => setToggleMenu(true)} />}
        {toggleMenu && (
          <div className={`${styles['tsp__navbar-menu_container']} ${styles['scale-up-center']}`}>
          <div className={styles['tsp__navbar-menu_container-links']}>
    {navLinks.map((link, index) => (
      <p key={index}><Link to={link.path}>{link.name}</Link></p>
    ))}
  </div>
            <div className={styles['tsp__navbar-menu_container-links-sign']}>
              {isLoggedIn ? ( // If user is logged in
                <>
                  <p>Welcome, {userEmail}!</p>
                  <button type="button" onClick={handleSignOut}>Sign out</button>
                </>
              ) : (
                <>
                  <button type="button" onClick={() => setModalOpen(true)}>Sign up</button>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <IconButton 
            aria-label="close" 
            onClick={() => setModalOpen(false)}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
          <SignUp />
        </Box>
      </Modal>
    </div>
  );
};

export default Navbar;
