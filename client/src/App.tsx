import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignupPage from "./pages/signupPage";
import LoginPage from "./pages/loginPage";
import LandingPage from "./pages/Landing";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<div className="p-8">Dashboard - Coming Soon! 🌸</div>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
