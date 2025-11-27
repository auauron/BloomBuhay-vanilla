import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
  min?: string | number;
  max?: string | number;
  maxLength?: number;
}

export default function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
  min,
  max,
  maxLength,
}: InputFieldProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const hasValue = value.length > 0;
  const inputType = isPassword && showPassword ? "text" : type;

  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={inputType}
          value={value}
          min={min}
          max={max}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={`w-full px-4 ${isPassword && hasValue ? "pr-10" : ""} py-3 rounded-lg border ${
            error ? "border-red-400 bg-red-50" : "border-gray-300"
          } focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-400`}
        />
        {isPassword && hasValue && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute inset-y-0 right-0 flex items-center px-3 text-gray-500 hover:text-gray-700"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
