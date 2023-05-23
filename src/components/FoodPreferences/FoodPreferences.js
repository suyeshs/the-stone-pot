import React, { useState, useEffect, useContext } from "react";
import { firestore } from "../../api/firebase";
import { updateDoc, doc, getDoc } from "firebase/firestore";
import { AuthContext } from "../../AuthContext";
import { useNavigate } from 'react-router-dom';

const FoodPreferences = () => {
  const authState = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
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
    const fetchUserData = async () => {
      try {
        console.log('Fetching user data...');
        const userDocRef = doc(firestore, 'users', authState.userEmail);
        const userDocSnapshot = await getDoc(userDocRef);
        const userData = userDocSnapshot.data();
        console.log('Fetched user data:', userData);
  
        if (userData && userData.food_preference) {
          const { foodPreference, specialDiet, nonVegItems } = userData.food_preference;
          setFoodPreference(foodPreference || '');
          setSpecialDiet(specialDiet || '');
          setNonVegItems(nonVegItems || {});
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        setLoading(false);
      }
    };
  
    if(authState.isLoggedIn) {
      fetchUserData();
    } else {
      console.log('No user is signed in.');
      setLoading(false);
    }
  }, [navigate, authState]);

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

  const updateProfileData = async (userEmail, profileData) => {
    const userDocRef = doc(firestore, 'users', userEmail);
    await updateDoc(userDocRef, {food_preference: profileData}); // Pass profileData as the second argument
    console.log('Profile data updated:', profileData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = authState.userEmail;
      
      if(!user) {
        throw new Error("User is not signed in.");
      }
  
      // Prepare the updated profile data
      const profileData = {
        foodPreference,
        specialDiet,
        nonVegItems,
      };
  
      // Update the profile data
      await updateProfileData(user, profileData);
  
      // Redirect or perform any other action after the update
      // navigate('/find-dishes'); // Remove this line
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
