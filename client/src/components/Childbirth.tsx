import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

export default function Childbirth() {
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

  return (
    <div style={{ maxWidth: "800px" }} className="flex justify-center">
      <div
        style={{ maxWidth: "700px", maxHeight: "450px" }}
        className="dropdown-container bg-white w-full m-auto rounded-2xl max-h-[80vh] overflow-y-auto shadow-lg p-8 pb-4 mb-6"
      >
        {/* baby's details */}
        <div className="baby-details flex flex-col">
          <div className="flex flex-col items-start">
            <label className="block">
              <h2 className="font-semibold text-bloomBlack text-left">
                Baby's Name
              </h2>
              <input
                type="text"
                name="babyName"
                value={inputValue}
                onChange={handleTextChange}
                placeholder="Enter your baby's name"
                className="border border-gray-300 rounded-lg p-3 mt-3 ml-4 w-64"
              ></input>
            </label>

            <label className="block">
              <h2 className="font-semibold text-bloomBlack text-left mt-4">
                Baby's Age
              </h2>
              <input
                type="number"
                value={value}
                onChange={handleChange}
                placeholder="Enter your baby's age in months"
                className="ml-4 text-bloomBlack w-60 m-4 border rounded-lg p-3"
              ></input>
            </label>
            <label className="block">
              <h2 className="mt-3 font-semibold text-bloomBlack text-left">
                Baby's Gender
              </h2>
            </label>

            <div className="relative">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex justify-between p-4 mt-4 ml-4 border-gray-300 border rounded-lg bg-white hover:border-[#F875AA] transition-colors cursor-pointer text-left w-96"
              >
                <span
                  className={
                    selectedGender ? "text-bloomBlack" : "text-[#9a9a9a]"
                  }
                >
                  {selectedGender || "What's your baby's gender?"}
                </span>
                <ChevronDownIcon
                  size={20}
                  className={`text-[#9a9a9a] transition-transform ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Dropdown menu */}
              {isOpen && (
                <div className="dropdown-menu absolute top-full left-4 mt-1 bg-white border border-[#9a9a9a] rounded-lg shadow-lg z-10 w-64">
                  {babyGenders.map((gender, index) => (
                    <div
                      key={gender}
                      onClick={() => handleGenderSelect(gender)}
                      className={`p-4 cursor-pointer hover:bg-bloomWhite transition-colors text-left ${
                        selectedGender === gender
                          ? "bg-bloomWhite text-bloomPink"
                          : "text-bloomBlack"
                      }`}
                    >
                      {gender}
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Next button */}
            <div className="flex justify-center w-full mt-4">
              <button
                className={`next-button w-64 rounded-lg font-semibold transition-colors grid place-items-center${
                  selectedGender
                    ? "cursor-pointer bg-bloomPink text-white hover:bg-pink-600"
                    : "cursor-not-allowed bg-gray-300 text-gray-500"
                }`}
                disabled={!selectedGender}
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
