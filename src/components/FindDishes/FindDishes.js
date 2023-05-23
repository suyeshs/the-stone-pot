import React, { useState, useEffect, useCallback } from "react";
import CuisineCard from "../CuisineCards/CuisineCards";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { auth, firestore } from "../../api/firebase";

const FindDishes = () => {
  const [cuisines, setCuisines] = useState([]);
  const [currentCuisineIndex, setCurrentCuisineIndex] = useState(0);

  const moveToNextCuisine = useCallback(() => {
    console.log("Move to next cuisine");
    setCurrentCuisineIndex((prevIndex) => prevIndex + 1);
  }, []);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/cuisines/");
        const data = await response.json();
        console.log("Fetched data:", data);
        if (Array.isArray(data)) {
          const sanitizedData = data.map((cuisine) => cuisine.replace(/[^\w\s]/gi, ""));
          console.log("Sanitized data:", sanitizedData);
          setCuisines(sanitizedData);
        } else {
          console.error("Error fetching cuisines: Invalid data format");
        }
      } catch (error) {
        console.error("Error fetching cuisines:", error);
      }
    };

    fetchCuisines();
  }, []);

  const handleLike = useCallback(async () => {
    const likedCuisine = cuisines[currentCuisineIndex];
    console.log("Current cuisine index (before like):", currentCuisineIndex);

    if (auth.currentUser) {
      try {
        await updateProfileWithLikedCuisine(likedCuisine);
        console.log("Liked cuisine added to user's profile");
        moveToNextCuisine();
      } catch (error) {
        console.error("Error updating user's profile:", error);
      }
    } else {
      console.error("User not authenticated");
    }
  }, [cuisines, currentCuisineIndex, moveToNextCuisine]);

  const handleDislike = useCallback(async () => {
    const dislikedCuisine = cuisines[currentCuisineIndex];
    console.log("Current cuisine index (before dislike):", currentCuisineIndex);
    console.log("Disliked Cuisine: ", dislikedCuisine);

    if (auth.currentUser) {
      try {
        await updateProfileWithDislikedCuisine(dislikedCuisine);
        console.log("Disliked cuisine removed from user's profile");
        moveToNextCuisine();
      } catch (error) {
        console.error("Error updating user's profile:", error);
      }
    } else {
      console.error("User not authenticated");
    }
  }, [cuisines, currentCuisineIndex, moveToNextCuisine]);

  const updateProfileWithLikedCuisine = async (likedCuisine) => {
    const userFoodPrefDoc = doc(firestore, "users", auth.currentUser.email);
    await updateDoc(userFoodPrefDoc, {
      likedCuisines: arrayUnion(likedCuisine),
    }, {merge: true});
  };
  
  const updateProfileWithDislikedCuisine = async (dislikedCuisine) => {
    const userFoodPrefDoc = doc(firestore, "users", auth.currentUser.email);
    await updateDoc(userFoodPrefDoc, {
      dislikedCuisines: arrayUnion(dislikedCuisine),
    }, {merge: true});
  };
  return (
    <div>
      <h2>Find Dishes</h2>
      {currentCuisineIndex < cuisines.length ? (
        <CuisineCard
          cuisine={cuisines[currentCuisineIndex]}
          handleLike={handleLike}
          handleDislike={handleDislike}
          moveToNextCuisine={moveToNextCuisine}
        />
      ) : (
        <p>No more cuisines to display.</p>
      )}
    </div>
  );
  };
  
  export default FindDishes;