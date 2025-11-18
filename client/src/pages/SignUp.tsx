import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authService } from "../services/authService";
import { ValidationError } from "../types/auth";
import InputField from "../components/ui/inputField";
import AuthToggle from "../components/AuthToggle";

export default function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
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

    const result = await authService.signup({
      fullName,
      email,
      password,
      confirmPassword,
    });

    setLoading(false);

    if (result.success) {
      // Include fullName and email in navigation state
      navigate("/mainsetup", { state: { fullName, email } });
    } else {
      if (result.errors) setErrors(result.errors);
      if (result.error) setGeneralError(result.error);
    }
  };

  const handleLoginRedirect = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-bloomWhite flex flex-col items-center justify-center overflow-y-auto">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-6 ">
          <div className="flex items-center justify-center -mb-12 -ml-2 mr-20">
            <img src="../assets/logo_pink.png" alt="Logo" className="h-40" />
            <h1 className="font-poppins text-7xl font-bold text-bloomPink -ml-6">
              <span className="block leading-none">Bloom</span>
              <span className="block -mt-4">Buhay</span>
            </h1>
          </div>
          <h2 className="mt-10 font-rubik text-xl font-bold text-bloomBlack -ml-2">
            Let's get you started!
          </h2>
          <p className="font-rubik text-bloomBlack text-xs -mb-2">
            Sign up to start your journey of growth.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl w-500 shadow-lg p-6 pl-16 pr-16">
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            <AuthToggle />

            {/* General Error Message */}
            {generalError && (
              <div className="p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {generalError}
              </div>
            )}
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
            <div>
              <button
              type="submit"
              disabled={loading}
              className="mx-auto mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-r from-bloomPink to-bloomYellow px-8 py-4 text-white font-semibold shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 min-w-[500px] -mb-5"
            >
              {loading ? "Signing Up..." : "Sign Up"}
            </button>
            </div>
          </form>

          {/* Already have an account section */}
          <div className="text-center mt-7">
            <button
              type="button"
              onClick={handleLoginRedirect}
              className="text-xs hover:underline text-gray-400 mt-2"
            >
              Already have an account?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
