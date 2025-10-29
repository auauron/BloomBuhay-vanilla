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
        <div className="baby-details flex flex-col items-start">
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
            <h2 className="mt-4 font-semibold text-bloomBlack text-left">
              Baby's Gender
            </h2>
          </label>
          <div className="relative mb-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="flex items-center justify-between p-4 mt-4  ml-4 border-gray-300 border rounded-lg bg-white hover:border-[#F875AA] transition-colors cursor-pointer text-left"
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
              <div className="dropdown-menu absolute top-full text-left left-0 right-0 mt-1 bg-white border border-[#9a9a9a] rounded-lg shadow-lg z-10">
                {babyGenders.map((gender, index) => (
                  <div
                    key={gender}
                    onClick={() => handleGenderSelect(gender)}
                    className={`choices p-4 cursor-pointer hover:bg-bloomWhite transition-colors items-start text-left ${
                      index !== babyGenders.length - 1 ? "" : ""
                    } ${
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
          <button
            className={`next-button w-full rounded-lg font-semibold transition-colors ${
              selectedGender ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            disabled={!selectedGender}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
