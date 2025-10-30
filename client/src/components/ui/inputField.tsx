import React from "react";

interface InputFieldProps {
  label: string;
  type: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  error?: string;
}

export default function InputField({
  label,
  type,
  value,
  onChange,
  placeholder,
  error,
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-4 py-3 rounded-lg border ${
          error ? "border-red-400 bg-red-50" : "border-gray-300"
        } focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-400`}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
