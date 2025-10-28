import React from "react";
import "../index.css";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();
  const handleSignUp = () => {
    navigate("/signup");
  };
  const handleLogIn = () => {
    navigate("/login");
  }


  return (
    <div className="landing-container flex items-center justify-center gap-4">
      <div className="content">
        <img
          src="/assets/logo_white.webp" className="logo object-contain" />
        <h1 className="title text-5xl font-bold font-poppins">
          Bloom <span>Buhay</span>
        </h1>
        <p className="subtitle text-lg font-rubik">For a life that gives life.</p>

        <div className="buttons-section">
          <p className="start-text">Start Blooming</p>
          <div className="buttons-container">
            <button className="signup-btn" onClick={handleSignUp}>Sign Up</button>
            <button className="login-btn" onClick={handleLogIn}>Log In</button>
          </div>
        </div>
      </div>
    </div>
  );
}