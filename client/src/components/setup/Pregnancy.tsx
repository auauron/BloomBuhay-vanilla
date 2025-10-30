// src/components/Pregnancy.tsx
import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import InputField from "../ui/inputField";
import SetupHeader from "../ui/SetupHeader";
import NextButton from "../ui/NextButton";

interface PregnancyProps {
  onComplete?: () => void;
}

export default function Pregnancy({ onComplete }: PregnancyProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [value, setValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");

  const babyGenders = ["Girl", "Boy", "Unknown"];

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    setIsOpen(false);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDate(e.target.value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  const handleNext = () => {
    // basic validation: require selectedGender (matches existing disabled logic)
    if (!selectedGender) return;

    // save or validate data here if needed
    onComplete?.();
  };

  return (
    <div className="bg-bloomWhite min-h-screen flex flex-col">
      <SetupHeader />
      <div className="flex-1 flex justify-center px-6 mt-1">
        <div
          style={{ maxWidth: "800px" }}
          className="flex justify-center w-full"
        >
          <div
            style={{ maxWidth: "700px", maxHeight: "450px" }}
            className="dropdown-container bg-white w-full m-auto rounded-2xl max-h-[80vh] overflow-y-auto shadow-lg p-8 pb-4 mb-6"
          >
            <div className="text-left ">
              <h2 className="text-bloomBlack font-semibold">
                How many weeks pregnant are you?
              </h2>

              {/* Radio button */}
              <div className="radio-btn">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="radioGroup"
                    value="option1"
                    checked={selectedOption === "option1"}
                    onChange={handleOptionChange}
                    className="w-3 h-3 focus:ring-bloomPink focus:ring-2 focus:ring-opacity-50 rounded-full checked:bg-bloomPink checked:border-bloomPink appearance-none focus:outline-none border-2"
                  />
                  <div className="w-[270px]">
                    <InputField
                      label=""
                      type="number"
                      value={value}
                      onChange={setValue}
                      placeholder="Enter the number of weeks"
                    />
                  </div>
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
                  />
                  <div className="flex-1">
                    <h2 className="text-bloomBlack font-semibold">
                      I don't know.
                    </h2>
                    <p className="text-bloomBlack ">
                      Don't worry. We can estimate it for you! When was your
                      last menstrual period?
                    </p>
                    <div className="w-60 mt-2">
                      <InputField
                        label=""
                        type="date"
                        value={selectedDate}
                        onChange={setSelectedDate}
                        placeholder="Select the date"
                      />
                    </div>
                  </div>
                </label>

                {/*Baby's details */}
                <hr className="border-gray-200 my-4" />
                <div className="baby-details">
                  <label>
                    <h2 className="font-semibold text-bloomBlack">
                      Baby's Name
                    </h2>
                    <div className="ml-4 mt-3 w-60">
                      <InputField
                        label=""
                        type="text"
                        value={inputValue}
                        onChange={setInputValue}
                        placeholder="Enter your baby's name"
                      />
                    </div>
                  </label>
                  <label>
                    <h2 className="mt-4 font-semibold text-bloomBlack">
                      Baby's Gender
                    </h2>
                  </label>
                  <div className="relative mb-4 w-[350px] ml-4">
                    <button
                      onClick={() => setIsOpen(!isOpen)}
                      className="flex items-center justify-between p-4 mt-4 border-gray-300 border rounded-lg bg-white hover:border-[#F875AA] transition-colors text-left w-full"
                      type="button"
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
                      <div className="dropdown-menu absolute top-full left-0 mt-1 bg-white border border-[#9a9a9a] rounded-lg shadow-lg z-10 w-full">
                        {babyGenders.map((gender) => (
                          <div
                            key={gender}
                            onClick={() => handleGenderSelect(gender)}
                            className={`choices p-4 hover:bg-bloomWhite transition-colors ${
                              selectedGender === gender
                                ? "bg-bloomWhite text-bloomPink"
                                : "text-bloomBlack"
                            }`}
                            role="button"
                            tabIndex={0}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" || e.key === " ")
                                handleGenderSelect(gender);
                            }}
                          >
                            {gender}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Next button */}
                    <NextButton
                      onComplete={onComplete}
                      selectedGender={selectedGender}
                      route="/dashboard"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
