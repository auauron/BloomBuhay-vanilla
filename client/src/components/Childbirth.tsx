// src/components/Childbirth.tsx
import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

interface ChildbirthProps {
  onComplete?: () => void;
}

export default function Childbirth({ onComplete }: ChildbirthProps) {
  const [value, setValue] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    setIsOpen(false);
  };

  const babyGenders = ["Girl", "Boy"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleNext = () => {
    // basic validation: require a selected gender (matches other components)
    if (!selectedGender) return;

    // TODO: save the data (API/localStorage) before completing if needed

    // inform parent (MainSetup) that setup is complete and navigate to dashboard
    onComplete?.();
  };

 return (
  <div style={{ maxWidth: "800px" }} className="flex justify-center">
    <div
      style={{ maxWidth: "700px", maxHeight: "450px" }}
      className="dropdown-container bg-white w-full m-auto rounded-2xl max-h-[80vh] overflow-y-auto shadow-lg p-8 pb-4 mb-6 relative"
    >
      <div className="baby-details flex flex-col">
        <div className="flex flex-col items-start">
          {/* Baby's Name */}
          <label className="block">
            <h2 className="font-semibold text-bloomBlack text-left">Baby's Name</h2>
            <input
              type="text"
              name="babyName"
              value={inputValue}
              onChange={handleTextChange}
              placeholder="Enter your baby's name"
              className="border border-gray-300 rounded-lg p-3 mt-3 ml-4 w-64 cursor-text"
            />
          </label>

          <label className="block">
            <h2 className="font-semibold text-bloomBlack text-left mt-4">Baby's Age</h2>
            <input
              type="number"
              value={value}
              onChange={handleChange}
              placeholder="Enter your baby's age in months"
              className="ml-4 text-bloomBlack w-60 m-4 border rounded-lg p-3 cursor-text"
            />
          </label>

          {/* Baby's Gender */}
          <label className="block">
            <h2 className="mt-3 font-semibold text-bloomBlack text-left">Baby's Gender</h2>
          </label>

          {/* Dropdown*/}
          <div className="relative mb-4 z-10">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex justify-between items-center p-4 mt-4 ml-4 border-gray-300 border rounded-lg bg-white hover:border-[#F875AA] transition-colors cursor-pointer text-left w-96"
              type="button"
              aria-haspopup="listbox"
              aria-expanded={isOpen}
            >
              <span className={selectedGender ? "text-bloomBlack" : "text-[#9a9a9a]"}>
                {selectedGender || "What's your baby's gender?"}
              </span>
              <ChevronDownIcon
                size={20}
                className={`text-[#9a9a9a] transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {isOpen && (
              <div
                role="listbox"
                className="absolute left-4 top-full mt-1 bg-white border border-[#9a9a9a] rounded-lg shadow-lg z-50 w-64"
                onMouseDown={(e) => e.preventDefault()} 
              >
                {babyGenders.map((gender) => (
                  <div
                    key={gender}
                    onClick={() => handleGenderSelect(gender)}
                    className={`p-4 cursor-pointer hover:bg-bloomWhite transition-colors text-left ${
                      selectedGender === gender
                        ? "bg-bloomWhite text-bloomPink"
                        : "text-bloomBlack"
                    }`}
                    role="option"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") handleGenderSelect(gender);
                    }}
                  >
                    {gender}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Next Button*/}
          <div className="flex justify-center w-full mt-4">
            <button
              onClick={handleNext}
              className={`rounded-lg font-semibold transition-colors grid place-items-center ${
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
        </div>
      </div>
    </div>
  </div>
);

}
