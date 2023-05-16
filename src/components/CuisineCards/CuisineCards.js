import React from "react";

const CuisineCards = ({ cuisine, handleLike, handleDislike }) => {
  const onLike = () => {
    handleLike();
  };

  const onDislike = () => {
    handleDislike();
  };

  return (
    <div className="card">
      <h3>{cuisine}</h3>
      <div>
        <button onClick={onLike}>Like</button>
        <button onClick={onDislike}>Dislike</button>
      </div>
    </div>
  );
};

export default CuisineCards;
