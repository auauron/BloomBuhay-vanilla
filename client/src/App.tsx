import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Article from "./pages/Article";
import Dashboard from "./pages/Dashboard";
import SignUp from "./pages/SignupPage";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/article/:id" element={<Article />} />
      </Routes>
    </Router>
  );
}