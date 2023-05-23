import React from 'react';
import { SubHeading } from '../../components';
import images from '../../constants/images';
import styles from './MainSection.module.css';

const MainSection = () => {
  const imageURL = images.headimg;

  return (
    <div className={styles.tsp__header_section__padding}>
      <div className={styles.content}>
        
        <h1 className={styles.heading}>Welcome to The Stone Pot </h1>
        <p className={styles.description}>
        Your Ultimate Meal Planning and In-Home Cooking Solution, where meal planning, pre-prepped ingredients, and skilled cooks come together to transform your culinary journey. 
        </p>
        <button className={styles.button}>Explore Menu</button>
      </div>

      
    </div>
  );
};

export default MainSection;
