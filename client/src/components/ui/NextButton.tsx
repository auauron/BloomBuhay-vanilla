import React from "react";
import { useNavigate } from "react-router-dom";

interface NextButtonProps {
  onComplete?: () => void;
  route?: string;
  isReady?: boolean;
}

export default function NextButton({
  onComplete,
  route,
  isReady = false,
}: NextButtonProps) {
  const navigate = useNavigate();

  const handleNext = () => {
    if (!isReady) return; 
    onComplete?.();
    if (route) navigate(route);
  };

  return (
    <div className="flex justify-center w-full">
      <button
        onClick={handleNext}
        className="next-button rounded-lg font-semibold transition-colors"
        disabled={!isReady} 
        type="button"
      >
        <span>Next</span>
      </button>
    </div>
  );
}
