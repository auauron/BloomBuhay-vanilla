import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { ValidationError } from "../types/auth";
import InputField from "../components/inputField";

export default function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find((err) => err.field === fieldName)?.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const result = await authService.signup({
      fullName,
      email,
      password,
      confirmPassword,
    });

    setLoading(false);

    if (result.success) {
      navigate("/login"); // Redirect after successful signup
    } else {
      if (result.errors) setErrors(result.errors);
    }
  };

  const handleSignupRedirect = () => {
    navigate("/signup");
  };
  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bloomWhite flex items-center justify-center">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-6">
          
          <div className="flex items-center justify-center -mb-6 -ml-2 mr-20">
            <img src="../assets/logo_pink.png" alt="Logo" className="h-40" />
            <h1 className="font-poppins text-7xl font-bold text-bloomPink -ml-6">
              <span className="block leading-none">Bloom</span>
              <span className="block -mt-4">Buhay</span>
            </h1>
          </div>
          <h2 className="font-rubik text-xl font-bold text-gray-800 -ml-2">
            Let's get you started!
          </h2>
          <p className="font-rubik text-gray-600 text-xs -mb-2">
            Sign up to start your journey of growth.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl w-500 shadow-lg p-8 -pb- pl-16 pr-16">
          
          <form onSubmit={handleSubmit} className="space-y-2 mt-2">
            <div className="flex w-full mx-auto rounded-full bg-pink-100 p-1">
            <button
              onClick={handleLoginRedirect}
              className="flex-1 py-2 rounded-full text-sm font-medium text-pink-500 hover:bg-pink-50 transition"
            >
              Log In
            </button>
            <button
              onClick={handleLoginRedirect}
              className="flex-1 py-2 rounded-full text-sm font-medium text-white bg-bloomPink shadow-md hover:bg-bloomPink transition"
              disabled
            >
              Sign Up
            </button>
          </div>
            <InputField
              label="Full Name"
              type="text"
              value={fullName}
              onChange={setFullName}
              placeholder="Enter your name"
              error={getFieldError("fullName")}
            />

            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              error={getFieldError("email")}
            />

            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              error={getFieldError("password")}
            />

            <InputField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Re-enter your password"
              error={getFieldError("confirmPassword")}
            />

            <button
              type="submit"
              disabled={loading}
              className="mx-auto mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-r from-bloomPink to-bloomYellow px-8 py-4 text-white font-semibold shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 min-w-[500px]"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>

            {/* Already have an account section */}
            <div className="text-center mt-6">
              <button type="button" onClick={handleLoginRedirect} className="text-sm text-gray-500 mb-3">
                Already have an account?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
