import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import BloomGuide from "./pages/BloomGuide";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/bloomguide" element={<BloomGuide />} />
      </Routes>
    </Router>
  );
}