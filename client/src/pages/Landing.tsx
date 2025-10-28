import React from "react";
import "../index.css";

export default function Landing() {
  return (
    <div className="landing-container flex items-center justify-center gap-4">
      <div className="content">
        <img
          src="/assets/logo_white.webp" className="logo object-contain" />
        <h1 className="title text-5xl font-bold font-poppins">
          Bloom <span>Buhay</span>
        </h1>
        <p className="subtitle text-lg font-rubik">For a life that gives life.</p>
        <button className="start-btn">Start Blooming →</button>
      </div>
    </div>
  );
}
