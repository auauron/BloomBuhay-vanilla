import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { ValidationError } from '../types/auth';
import InputField from '../components/inputField';

export default function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [generalError, setGeneralError] = useState('');

  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find((err) => err.field === fieldName)?.message;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setGeneralError('');

    const result = await authService.signup({
      fullName,
      email,
      password,
      confirmPassword,
    });

    setLoading(false);

    if (result.success) {
      navigate('/dashboard'); // Redirect after successful signup
    } else {
      if (result.errors) setErrors(result.errors);
      if (result.error) setGeneralError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-bloomWhite flex items-center justify-center">
      <div className="max-w-3xl w-full">
        {/* Logo & Header */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center -mb-8 -ml-16 mr-20">
            <img src="../assets/logo_pink.webp" alt="Logo" className="h-56" />
            <h1 className="font-poppins text-7xl font-bold text-bloomPink -ml-12">
              Bloom<br/>Buhay
            </h1>
          </div>
          <h2 className="font-rubik text-xl font-bold text-gray-800">
            Let's get you started!
          </h2>
          <p className="font-rubik text-gray-600 text-xs -mb-2">
            Sign up to start your journey of growth.
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl w-500 shadow-lg p-8 pl-16 pr-16">
          {generalError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {generalError}
            </div>
          )}
          <p className="text-center text-sm text-gray-600">
            <Link to="/login" className="text-bloomPink font-semibold hover:underline">
              Log In
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <InputField
              label="Full Name"
              type="text"
              value={fullName}
              onChange={setFullName}
              placeholder="Enter your name"
              error={getFieldError('fullName')}
            />

            <InputField
              label="Email Address"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="Enter your email"
              error={getFieldError('email')}
            />

            <InputField
              label="Password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="Enter your password"
              error={getFieldError('password')}
            />

            <InputField
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="Re-enter your password"
              error={getFieldError('confirmPassword')}
            />

            <button
              type="submit"
              disabled={loading}
              className="mx-auto mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-r from-bloomPink to-bloomYellow px-8 py-4 text-white font-semibold shadow-md transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 min-w-[500px]"
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}