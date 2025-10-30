import React from "react";
import { useNavigate } from "react-router-dom";

interface NextButtonProps {
  onComplete?: () => void;
  selectedGender?: string;
  route?: string; // optional target route
}

export default function NextButton({ onComplete, selectedGender, route }: NextButtonProps) {
  const navigate = useNavigate();

  const handleNext = () => {
    if (!selectedGender) return;
    // inform parent first
    onComplete?.();
    // If a route is set, go there
    if (route) {
      navigate(route);
    }
  };

  return (
    <div className="flex justify-center w-full mt-4">
      <button
        onClick={handleNext}
        className={`next-button rounded-lg font-semibold transition-colors grid place-items-center ${
          selectedGender
            ? "cursor-pointer bg-bloomPink text-white hover:bg-pink-600"
            : "cursor-not-allowed bg-gray-300 text-gray-500 opacity-70"
        }`}
        style={{ width: "200px", height: "40px" }}
        disabled={!selectedGender}
        type="button"
      >
        Next
      </button>
    </div>
  );
}