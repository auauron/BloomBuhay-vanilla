import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";

export default function Pregnancy() {
  const [selectedOption, setSelectedOption] = useState("");
  const [value, setValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");

  const babyGenders = ["Girl", "Boy", "Unknown"];

  const handleGenderSelect = (gender) => {
    setSelectedGender(gender);
    setIsOpen(false);
  };

  const handleTextChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleDateChange = (e) => {
    setSelectedDate(e.target.value);
  };

  const handleChange = (e) => {
    setValue(e.target.value);
  };

  const handleOptionChange = (e) => {
    setSelectedOption(e.target.value);
  };

  return (
    <div style={{ maxWidth: "800px" }} className="flex justify-center">
      <div
        style={{ maxWidth: "700px" }}
        className="dropdown-container bg-white w-full m-auto rounded-2xl max-h-[80vh] overflow-y-auto shadow-lg p-6 mb-8"
      >
        <div className="text-left ">
          <h2 className="text-bloomBlack font-semibold">
            How many weeks pregnant are you?
          </h2>

          {/* Radio button */}

          <div className="radio-btn">
            <label>
              <input
                type="radio"
                name="radioGroup"
                value="option1"
                checked={selectedOption === "option1"}
                onChange={handleOptionChange}
                className="w-3 h-3 focus:ring-bloomPink focus:ring-2 focus:ring-opacity-50 rounded-full checked:bg-bloomPink checked:border-bloomPink appearance-none focus:outline-none border-2"
              ></input>
              <input
                type="number"
                value={value}
                onChange={handleChange}
                placeholder="Enter the number of weeks"
                className="ml-2 w-60 m-4 border rounded-lg p-3"
              ></input>
            </label>
            <br />
            <label className="flex items-start gap-3">
              <input
                type="radio"
                name="radioGroup"
                value="option2"
                checked={selectedOption === "option2"}
                onChange={handleOptionChange}
                className="w-3 h-3 focus:ring-bloomPink focus:ring-2 focus:ring-opacity-50 rounded-full checked:bg-bloomPink checked:border-bloomPink appearance-none focus:outline-none border-2 mt-1"
              ></input>
              <div className="flex-1">
                <h2 className="text-bloomBlack font-semibold">I don't know.</h2>
                <p className="text-bloomBlack ">
                  Don't worry. We can estimate it for you! When was your last
                  menstrual period?
                </p>
                <input
                  type="date"
                  id="lmp"
                  name="lmp"
                  value={selectedDate}
                  onChange={handleDateChange}
                  className="text-gray-400 w-30 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-bloomPink"
                ></input>
              </div>
            </label>

            {/*Baby's details */}
            <hr className="border-gray-200 my-4" />
            <div className="baby-details">
              <label>
                <h2 className="font-semibold text-bloomBlack">Baby's Name</h2>
                <input
                  type="text"
                  name="babyName"
                  value={inputValue}
                  onChange={handleTextChange}
                  placeholder="Enter your baby's name"
                  className="border rounded-lg p-3  ml-4 mt-3"
                ></input>
              </label>
              <label>
                <h2 className="mt-4 font-semibold text-bloomBlack">
                  Baby's Gender
                </h2>
              </label>
              <div className="relative mb-4">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="dropdown w-full flex items-center justify-between p-4 border-gray-100 border rounded-lg bg-white hover:border-[#F875AA] transition-colors cursor-pointer text-left"
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
                  <div className="dropdown-menu absolute top-full left-0 right-0 mt-1 bg-white border border-[#9a9a9a] rounded-lg shadow-lg z-10">
                    {babyGenders.map((gender, index) => (
                      <div
                        key={gender}
                        onClick={() => handleGenderSelect(gender)}
                        className={`choices p-4 cursor-pointer hover:bg-bloomWhite transition-colors ${
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
        </div>
      </div>
    </div>
  );
}
