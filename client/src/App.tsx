import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import BloomGuide from "./pages/BloomGuide";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import HealthTracker from "./pages/HealthTracker";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/bloomguide" element={<BloomGuide />} />
        <Route path="/healthtracker" element={<HealthTracker />} />
      </Routes>
    </Router>
  );
}