// src/components/Pregnancy.tsx
import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import NextButton from "../components/ui/NextButton";
import InputField from "./inputField";
import SetupHeader from "./SetupHeader";

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

  return (
    <div className="bg-bloomWhite min-h-screen flex flex-col">
      <SetupHeader />
      <div className="flex-1 flex justify-center px-6 mt-1">
        <div style={{ maxWidth: "800px" }} className="flex justify-center w-full">
          <div
            style={{ maxWidth: "700px", maxHeight: "450px" }}
            className="dropdown-container bg-white w-full m-auto rounded-2xl max-h-[80vh] overflow-y-auto shadow-lg p-8 pb-4 mb-6"
          >
            <div className="text-left ">
              <h2 className="text-bloomBlack font-semibold">How many weeks pregnant are you?</h2>

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
                    <h2 className="text-bloomBlack font-semibold">I don't know.</h2>
                    <p className="text-bloomBlack ">Don't worry. We can estimate it for you! When was your last menstrual period?</p>
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

                <NextButton
                  selectedGender={selectedGender} 
                  onComplete={onComplete} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
