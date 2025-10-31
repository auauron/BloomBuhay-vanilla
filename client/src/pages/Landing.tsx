import React from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";

export default function Landing() {
  const navigate = useNavigate();

  const handleStartBlooming = () => {
    navigate("/signup");
  };

  return (
    <div className="landing-container flex items-center justify-center ">
      <div className="content">
        <img src="/assets/logo_white.png" className="logo object-contain" />
        <h1 className="title text-5xl font-bold font-poppins">
          Bloom <span>Buhay</span>
        </h1>
        <p className="subtitle text-lg font-rubik">
          For a life that gives life.
        </p>
        <button className="start-btn" onClick={handleStartBlooming}>
          Start Blooming →
        </button>
      </div>
    </div>
  );
}
