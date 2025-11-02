import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import LandingPage from "./pages/Landing";
import BloomGuide from "./pages/BloomGuide";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignUp";
import LoginPage from "./pages/LoginPage";
import UserProfile from "./pages/UserProfile";
import MainSetup from "./pages/MainSetup";
import SetupSummary from "./pages/SetupSummary";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/userprofile" element={<UserProfile />} />
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mainsetup" element={<MainSetup />} />
        <Route path="/setup" element={<MainSetup />} />
        <Route path="/setup/summary" element={<SetupSummary />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        <Route path="/bloomguide" element={<BloomGuide />} />
      </Routes>
    </Router>
  );
}
