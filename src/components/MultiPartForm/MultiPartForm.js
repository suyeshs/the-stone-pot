import React, { useState } from "react";
import UserProfile from "../UserProfile/UserProfile";
import FoodPreferences from "../FoodPreferences/FoodPreferences";
import styles from "./MultiPartForm.module.css";

const MultiPartForm = () => {
  const [step, setStep] = useState(1);

  const nextStep = () => {
    setStep((prevStep) => prevStep + 1);
  };

  const previousStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const handleSubmit = () => {
    // Handle form submission logic here
    // You can perform any necessary validation, data processing, etc.
    // Once the form is submitted, you can navigate to the next step or perform any other action
    nextStep();
  };

  return (
    <div className={styles.multiPartForm}>
      {step === 1 && (
        <UserProfile nextStep={nextStep} />
      )}
      {step === 2 && (
        <FoodPreferences previousStep={previousStep} handleSubmit={handleSubmit} />
      )}
    </div>
  );
};

export default MultiPartForm;
