import React from "react";
import "../index.css";

export default function Landing() {
  const handleClick = () => {
    alert("Welcome!");
  };

  return (
    <div>
      <h1 className="font-poppins text-5xl font-bold mb-6">BloomBuhay 🌸</h1>
      <button onClick={handleClick}>Start Blooming</button>
    </div>
  );
}
