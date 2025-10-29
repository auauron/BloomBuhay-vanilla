import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/Landing";
import BloomGuide from "./pages/BloomGuide";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/loginPage";
import Planner from "./pages/Planner";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/bloomguide" element={<BloomGuide />} />
        <Route path="/planner" element={<Planner />} />
      </Routes>
    </Router>
  );
}