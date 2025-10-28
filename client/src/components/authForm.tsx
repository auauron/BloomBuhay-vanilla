import React, { useState } from 'react';
import { authService } from '../services/authService';
import { ValidationError } from '../types/auth';

type TabType = 'login' | 'signup';

export default function AuthForm() {
  const [activeTab, setActiveTab] = useState<TabType>('signup');
  
  // Form fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<ValidationError[]>([]);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Helper to get error for a specific field
  const getFieldError = (fieldName: string): string | undefined => {
    return errors.find(err => err.field === fieldName)?.message;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setGeneralError('');
    setSuccessMessage('');

    const result = await authService.signup({
      fullName,
      email,
      password,
      confirmPassword,
    });

    setLoading(false);

    if (result.success) {
      setSuccessMessage('Account created successfully! Welcome to BloomBuhay 🌸');
      // Redirect to dashboard or home page
      // window.location.href = '/dashboard';
    } else {
      if (result.errors) {
        setErrors(result.errors);
      }
      if (result.error) {
        setGeneralError(result.error);
      }
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);
    setGeneralError('');
    setSuccessMessage('');

    const result = await authService.login({
      email,
      password,
    });

    setLoading(false);

    if (result.success) {
      setSuccessMessage('Login successful! Welcome back 🌸');
      // Redirect to dashboard or home page
      // window.location.href = '/dashboard';
    } else {
      if (result.errors) {
        setErrors(result.errors);
      }
      if (result.error) {
        setGeneralError(result.error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <span className="text-6xl"></span>
            <h1 className="`text-5xl font-bold text-pink-500">
              Bloom<br/>Buhay
            </h1>
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            Let's get you started!
          </h2>
          <p className="text-gray-600 text-sm">
            Sign up to start your journey of growth
          </p>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          {/* Tabs */}
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all ${
                activeTab === 'login'
                  ? 'bg-gradient-to-r from-pink-400 to-orange-300 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Log In
            </button>
            <button
              onClick={() => setActiveTab('signup')}
              className={`flex-1 py-2 px-4 rounded-full font-semibold transition-all ${
                activeTab === 'signup'
                  ? 'bg-gradient-to-r from-pink-400 to-orange-300 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Error/Success Messages */}
          {generalError && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {generalError}
            </div>
          )}
          {successMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          {/* Sign Up Form */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Enter your name"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    getFieldError('fullName')
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-pink-300`}
                />
                {getFieldError('fullName') && (
                  <p className="mt-1 text-xs text-red-600">
                    {getFieldError('fullName')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    getFieldError('email')
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-pink-300`}
                />
                {getFieldError('email') && (
                  <p className="mt-1 text-xs text-red-600">
                    {getFieldError('email')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    getFieldError('password')
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-pink-300`}
                />
                {getFieldError('password') && (
                  <p className="mt-1 text-xs text-red-600">
                    {getFieldError('password')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    getFieldError('confirmPassword')
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-pink-300`}
                />
                {getFieldError('confirmPassword') && (
                  <p className="mt-1 text-xs text-red-600">
                    {getFieldError('confirmPassword')}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-400 to-orange-300 text-white font-semibold rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Signing Up...' : 'Sign Up'}
              </button>
            </form>
          )}

          {/* Login Form */}
          {activeTab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    getFieldError('email')
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-pink-300`}
                />
                {getFieldError('email') && (
                  <p className="mt-1 text-xs text-red-600">
                    {getFieldError('email')}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className={`w-full px-4 py-3 rounded-lg border ${
                    getFieldError('password')
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300'
                  } focus:outline-none focus:ring-2 focus:ring-pink-300`}
                />
                {getFieldError('password') && (
                  <p className="mt-1 text-xs text-red-600">
                    {getFieldError('password')}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 px-4 bg-gradient-to-r from-pink-400 to-orange-300 text-white font-semibold rounded-full hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
              >
                {loading ? 'Logging In...' : 'Log In'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}