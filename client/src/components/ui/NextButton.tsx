import React from "react";

interface NextButtonProps {
  onComplete?: () => void;
  selectedGender?: string; // Add this prop
}

export default function NextButton({ onComplete, selectedGender }: NextButtonProps) {
  const handleNext = () => {
    // basic validation: require a selected gender
    if (!selectedGender) return;

    // inform parent (MainSetup) that setup is complete and navigate to dashboard
    onComplete?.();
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