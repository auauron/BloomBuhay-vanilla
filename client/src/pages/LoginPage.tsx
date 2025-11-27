import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { ValidationError } from "../types/auth";
import InputField from "../components/ui/inputField";
import AuthToggle from "../components/AuthToggle";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [generalError, setGeneralError] = useState("");

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find((err) => err.field === fieldName)?.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setGeneralError("");

    const result = await authService.login({ email, password });

    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      if (result.errors) setErrors(result.errors);
      if (result.error) setGeneralError(result.error);
    }
  };

  // const handleSignupRedirect = () => {
  //   navigate("/signup");
  // };
  //placeholder route
  const handleforgotPassword = () => {
    navigate("/forgot-password");
  };
  return (
    <div className="min-h-screen bg-bloomWhite flex flex-col items-center justify-center px-4 sm:px-0 overflow-y-auto">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center -mb-12 -ml-2 mr-20">
            <img src="../assets/logo_pink.png" alt="Logo" className="sm:h-40 h-28 mr-2" />
            <h1 className="font-poppins text-6xl sm:text-7xl font-bold text-bloomPink -ml-6">
              <span className="block leading-none">Bloom</span>
              <span className="block -mt-4">Buhay</span>
            </h1>
          </div>
          <h2 className="font-rubik text-xl sm:text-xl mt-12 sm:mt-8 font-bold text-bloomBlack">
            Welcome back!
          </h2>
          <p className="font-rubik text-bloomBlack text-xs -mb-2">
            Continue your journey of motherhood.
          </p>
        </div>

        {/* forms */}
        <div className="bg-white rounded-2xl w-500 shadow-lg p-6 pl-16 pr-16 ">
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <AuthToggle />

            {/* General Error Message */}
            {generalError && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {generalError}
              </div>
            )}

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
              onChange={(val) => setPassword(val.slice(0, 25))}
              placeholder="Enter your password"
              error={getFieldError("password")}
              maxLength={25}
            />
            <button
              type="submit"
              disabled={loading}
              className="mx-auto mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-r from-bloomPink to-bloomYellow px-8 py-4 text-white font-semibold shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 w-full"
            >
              {loading ? "Logging in..." : "Log In"}
            </button>
            <div className="text-center text-xs text-gray-400 -mt-2 mb-2">
              <button
                type="button"
                onClick={handleforgotPassword}
                className="hover:underline"
              >
                Forgot Password?
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
