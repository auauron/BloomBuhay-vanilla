import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import InputField from "../ui/inputField";
import SetupHeader from "../ui/SetupHeader";
import NextButton from "../ui/NextButton";

interface PostpartumProps {
  onComplete?: (data: Record<string, any>) => void;
  fullName?: string;
  email?: string;
}

export default function Postpartum({ onComplete, fullName, email  }: PostpartumProps) {
  const [value, setValue] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

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
    // basic validation — require a selected gender (keeps current behavior)
    if (!selectedGender) return;

    // do any save/validation here (API call, localStorage...)
    // on success:
    const stageData = {
      motherhoodStage: "Postpartum",
      weeksAfterBirth: value,
      babyName: inputValue,
      babyGender: selectedGender,
      trackRecovery: selectedOption === "option1" ? true : false,
    };
    onComplete?.(stageData);
  };

  return (
    <div className="bg-bloomWhite min-h-screen flex flex-col">
      <SetupHeader />
      <div className="flex-1">
        <div
          style={{ maxWidth: "800px" }}
          className="flex justify-center px-6 mt-2"
        >
          <div
            style={{ maxWidth: "700px", maxHeight: "450px" }}
            className="dropdown-container bg-white w-full m-auto rounded-2xl max-h-[80vh] scrollbar-thin overflow-y-auto scrollbar-thumb-white/50 scrollbar-track hover:scrollbar-thumb-white/50 shadow-lg p-8 pb-4 mb-6"
          >
            <div className="text-left ">
              <h2 className="text-bloomBlack font-semibold">
                How many weeks has it been since you gave birth?
              </h2>
              <div className="ml-4 w-60 m-4">
                <InputField
                  label=""
                  type="number"
                  min="0"
                  value={value}
                  onChange={setValue}
                  placeholder="Enter the number of weeks"
                />
              </div>
            </div>

            {/* baby's details */}
            <hr className="border-gray-200 my-4" />
            <div className="baby-details flex flex-col items-start">
              <label className="block">
                <h2 className="font-semibold text-bloomBlack text-left">
                  Baby's Name
                </h2>
                <div className="mt-3 ml-4 w-64">
                  <InputField
                    label=""
                    type="text"
                    value={inputValue}
                    onChange={(val) =>
                      setInputValue(val.replace(/[^a-zA-Z\s]/g, ""))
                    }
                    placeholder="Enter your baby's name"
                  />
                </div>
              </label>
              <label className="block">
                <h2 className="mt-4 font-semibold text-bloomBlack text-left">
                  Baby's Gender
                </h2>
              </label>
              <div className="relative mb-4 ml-4 text-left">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center justify-between p-4 mt-4 border border-gray-300 rounded-lg bg-white hover:border-[#F875AA] transition-colors cursor-pointer text-left w-full"
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
                  <div className="absolute left-0 top-full mt-1 bg-white border border-[#9a9a9a] rounded-lg shadow-lg z-20 w-full">
                    {babyGenders.map((gender) => (
                      <div
                        key={gender}
                        onClick={() => handleGenderSelect(gender)}
                        className={`p-4 hover:bg-bloomWhite transition-colors cursor-pointer ${
                          selectedGender === gender
                            ? "text-bloomPink"
                            : "text-bloomBlack"
                        }`}
                      >
                        {gender}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* radio btn track recovery and milestones */}
              <div className="radio-btn items-start flex flex-col">
                <h2 className="font-semibold text-bloomBlack text-left mt-4">
                  Would you like to track your recovery and baby's milestones?
                </h2>
                <label className="text-bloomBlack font-rubik ml-2 p-3 mt-2">
                  <input
                    type="radio"
                    name="radioGroup"
                    value="option1"
                    onChange={handleOptionChange}
                    checked={selectedOption === "option1"}
                    className="w-3 h-3  mr-2 focus:ring-bloomPink focus:ring-2 focus:ring-opacity-50 rounded-full checked:bg-bloomPink checked;border-bloomPink appearance-none focus:outline-none border-2"
                  />
                  Yes
                </label>
                <label className="text-bloomBlack font-rubik ml-2 p-3">
                  <input
                    type="radio"
                    name="radioGroup"
                    value="option2"
                    checked={selectedOption === "option2"}
                    onChange={handleOptionChange}
                    className="w-3 h-3 mr-2 focus:ring-bloomPink focus:ring-2 focus:ring-opacity-50 rounded-full checked:bg-bloomPink checked;border-bloomPink appearance-none focus:outline-none border-2"
                  />
                  No
                </label>
              </div>

              {/* Next button */}
              <NextButton
                onComplete={handleNext}
                isReady={Boolean(inputValue && value && selectedGender)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
