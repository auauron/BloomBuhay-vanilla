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

    // Client-side validation for full name and password length
    if (fullName.length > 35) {
      setErrors((prev) => [...prev, { field: "fullName", message: "Full name must be at most 35 characters long." }]);
      setLoading(false);
      return;
    }
    if (password.length > 25) {
      setErrors((prev) => [...prev, { field: "password", message: "Password must be at most 25 characters long." }]);
      setLoading(false);
      return;
    }
    if (confirmPassword.length > 25) {
      setErrors((prev) => [...prev, { field: "confirmPassword", message: "Confirm password must be at most 25 characters long." }]);
      setLoading(false);
      return;
    }

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
    <div className="min-h-screen bg-bloomWhite flex flex-col items-center justify-center px-4 sm:px-0 overflow-y-auto">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-6 ">
          <div className="flex items-center justify-center -mb-12 -ml-2 mr-20">
            <img src="/logo_pink.png" alt="Logo" className="sm:h-40 h-28 mr-2" />
            <h1 className="font-poppins text-6xl sm:text-7xl font-bold text-bloomPink -ml-6">
              <span className="block leading-none">Bloom</span>
              <span className="block -mt-4">Buhay</span>
            </h1>
          </div>
          <h2 className="sm:mt-10 mt-12 font-rubik text-xl sm:text-xl font-bold text-bloomBlack -ml-2">
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
              maxLength={35}
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
              onChange={(val) => setPassword(val.slice(0, 25))}
              placeholder="Enter your password"
              error={getFieldError("password")}
              maxLength={25}
            />

            <InputField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(val) => setConfirmPassword(val.slice(0, 25))}
              placeholder="Re-enter your password"
              error={getFieldError("confirmPassword")}
              maxLength={25}
            />
            <div>
              <button
              type="submit"
              disabled={loading}
              className="mx-auto mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-r from-bloomPink to-bloomYellow px-8 py-4 text-white font-semibold shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 w-full -mb-5"
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
