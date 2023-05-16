import React, { useState, useEffect } from "react";
import CuisineCard from "../CuisineCards/CuisineCards";
import { doc, updateDoc } from "firebase/firestore";
import { auth, firestore } from "../../api/firebase";

const FindDishes = () => {
  const [cuisines, setCuisines] = useState([]);
  const [currentCuisineIndex, setCurrentCuisineIndex] = useState(0);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/cuisines/");
        const data = await response.json();
        console.log("Fetched data:", data);
        if (Array.isArray(data)) {
          const sanitizedData = data.map((cuisine) => cuisine.replace(/[^\w\s]/gi, ""));
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

  const handleLike = () => {
    const likedCuisine = cuisines[currentCuisineIndex];
  
    // Update the user's profile with the liked cuisine
    if (auth.currentUser) {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      updateDoc(userDocRef, {
        likedCuisines: FieldValue.arrayUnion(likedCuisine),
      })
        .then(() => {
          console.log("Liked cuisine added to user's profile");
          moveToNextCuisine();
        })
        .catch((error) => {
          console.error("Error updating user's profile:", error);
        });
    } else {
      console.error("User not authenticated");
    }
  };
  
  const handleDislike = () => {
    const dislikedCuisine = cuisines[currentCuisineIndex];
  
    // Update the user's profile with the disliked cuisine
    if (auth.currentUser) {
      const userDocRef = doc(firestore, "users", auth.currentUser.uid);
      updateDoc(userDocRef, {
        dislikedCuisines: FieldValue.arrayRemove(dislikedCuisine),
      })
        .then(() => {
          console.log("Disliked cuisine removed from user's profile");
          moveToNextCuisine();
        })
        .catch((error) => {
          console.error("Error updating user's profile:", error);
        });
    } else {
      console.error("User not authenticated");
    }
  };
  
  const moveToNextCuisine = () => {
    setCurrentCuisineIndex((prevIndex) => prevIndex + 1);
  };
  
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        handleLike();
      } else if (event.key === "ArrowLeft") {
        handleDislike();
      }
    };
  
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleLike, handleDislike]);
  
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
