// src/components/Childbirth.tsx
import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import InputField from "../ui/inputField";
import SetupHeader from "../ui/SetupHeader";
import NextButton from "../ui/NextButton";

interface ChildbirthProps {
  onComplete?: (data: Record<string, any>) => void;
  fullName?: string;
  email?: string;
}

export default function Childbirth({ onComplete,  fullName, email  }: ChildbirthProps) {
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
    const stageData = {
      motherhoodStage: "Early Childcare",
      babyName: inputValue,
      babyGender: selectedGender,
      babyAgeMonths: value,
    };

    // inform parent (MainSetup) that setup is complete and navigate to dashboard
    onComplete?.(stageData);
  };

  return (
    <div className="bg-bloomWhite min-h-screen flex flex-col">
      <SetupHeader />
      <div className="flex-1 flex justify-center px-6 mt-2">
        <div
          style={{ maxWidth: "800px" }}
          className="flex justify-center w-full"
        >
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
                  <h2 className="font-semibold text-bloomBlack text-left mt-4">
                    Baby's Age
                  </h2>
                  <div className="ml-4 w-[320px] m-4">
                    <InputField
                      label=""
                      type="number"
                      min="0"
                      value={value}
                      onChange={setValue}
                      placeholder="Enter your baby's age in months"
                    />
                  </div>
                </label>

                <label className="block">
                  <h2 className="mt-3 font-semibold text-bloomBlack ml-1 text-left">
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
    </div>
  );
}
