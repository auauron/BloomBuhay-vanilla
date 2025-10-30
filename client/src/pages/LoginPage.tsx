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

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find((err) => err.field === fieldName)?.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    const result = await authService.login({ email, password });

    setLoading(false);

    if (result.success) {
      navigate("/dashboard");
    } else {
      if (result.errors) setErrors(result.errors);
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
    <div className="min-h-screen bg-bloomWhite flex flex-col items-center justify-center">
      <div className="max-w-3xl w-full justify-center items-center">
        <div className="text-center mb-6">
          <div className="flex items-center justify-center -mb-6 -ml-2 mr-20">
            <img src="../assets/logo_pink.png" alt="Logo" className="h-40" />
            <h1 className="font-poppins text-7xl font-bold text-bloomPink -ml-6">
              <span className="block leading-none">Bloom</span>
              <span className="block -mt-4">Buhay</span>
            </h1>
          </div>
          <h2 className="font-rubik text-xl font-bold text-bloomBlack">
            Welcome back!
          </h2>
          <p className="font-rubik text-bloomBlack text-xs -mb-2">
            Continue your journey of motherhood.
          </p>
        </div>

        {/* forms */}
        <div className="bg-white rounded-2xl w-500 shadow-lg p-6 pl-16 pr-16">
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <AuthToggle/>

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
            <button
              type="submit"
              disabled={loading}
              className="mx-auto mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-r from-bloomPink to-bloomYellow px-8 py-4 text-white font-semibold shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 min-w-[500px]"
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
