import React, { useState, useEffect } from 'react';
import { auth, firestore } from '../../api/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const FoodPreferences = () => {
  const [loading, setLoading] = useState(true); // New loading state
  const [foodPreference, setFoodPreference] = useState('veg');
  const [specialDiet, setSpecialDiet] = useState('');
  const [nonVegItems, setNonVegItems] = useState({
    chicken: false,
    mutton: false,
    fish: false,
    pork: false,
    buff: false,
  });

  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        try {
          const userDocRef = doc(firestore, 'users', user.email);
          const userDocSnapshot = await getDoc(userDocRef);
          const userData = userDocSnapshot.data();

          if (userData && userData.food_preference) {
            const { foodPreference, specialDiet, nonVegItems } = userData.food_preference;
            setFoodPreference(foodPreference);
            setSpecialDiet(specialDiet);
            setNonVegItems(nonVegItems);
            
            navigate('/find-dishes');
          } else {
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching profile data:', error);
        }
      } else {
        console.log("No user is signed in.");
      }
    });

    // Clean up the subscription on unmount
    return () => unsubscribe();
  }, [navigate]);


  const handleFoodPreferenceChange = (e) => {
    setFoodPreference(e.target.value);
  };

  const handleSpecialDietChange = (e) => {
    setSpecialDiet(e.target.value);
  };

  const handleNonVegItemsChange = (e) => {
    const { name, checked } = e.target;
    setNonVegItems((prevState) => ({ ...prevState, [name]: checked }));
  };

  const updateProfileData = async (user, profileData) => {
    const userDocRef = doc(firestore, 'users', user.email);
    const foodPreferenceDocRef = doc(userDocRef, 'food_preferences', 'base');
    await setDoc(foodPreferenceDocRef, profileData);
    console.log('Profile data updated:', profileData);
  };
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;

      // Prepare the updated profile data
      const profileData = {
        foodPreference,
        specialDiet,
        nonVegItems,
      };

      // Update the profile data
      await updateProfileData(user, profileData);

      // Redirect or perform any other action after the update
      navigate('/find-dishes');
    } catch (error) {
      console.error('Error updating profile data:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>; // Display a loading indicator while fetching data
  }

  


  return (
    <div>
      <h2>Food Preferences</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input type="radio" name="foodPreference" value="veg" checked={foodPreference === 'veg'} onChange={handleFoodPreferenceChange} />
            Veg
          </label>
        </div>
        <div>
          <label>
            <input type="radio" name="foodPreference" value="non-veg" checked={foodPreference === 'non-veg'} onChange={handleFoodPreferenceChange} />
            Non-Veg
          </label>
        </div>
        {foodPreference === 'non-veg' && (
          <div>
            <p>Non-Veg Options:</p>
            <label>
              <input type="checkbox" name="chicken" checked={nonVegItems.chicken} onChange={handleNonVegItemsChange} />
              Chicken
            </label>
            <label>
              <input type="checkbox" name="mutton" checked={nonVegItems.mutton} onChange={handleNonVegItemsChange} />
              Mutton
            </label>
            <label>
              <input type="checkbox" name="fish" checked={nonVegItems.fish} onChange={handleNonVegItemsChange} />
              Fish
            </label>
            <label>
              <input type="checkbox" name="pork" checked={nonVegItems.pork} onChange={handleNonVegItemsChange} />
              Pork
            </label>
            <label>
              <input type="checkbox" name="buff" checked={nonVegItems.buff} onChange={handleNonVegItemsChange} />
              Buff
            </label>
          </div>
        )}
        <div>
          <label htmlFor="special-diet">Special Diet:</label>
          <select id="special-diet" value={specialDiet} onChange={handleSpecialDietChange}>
            <option value="">Select</option>
            <option value="keto">Keto</option>
            <option value="low-carb">Low Carb</option>
            <option value="gluten-free">Gluten Free</option>
          </select>
        </div>
        <button type="submit">Save Preferences</button>
</form>
</div>
);
    
};
export default FoodPreferences;
