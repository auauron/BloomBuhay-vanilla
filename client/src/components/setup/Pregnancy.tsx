// src/components/Pregnancy.tsx
import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import InputField from "../ui/inputField";
import SetupHeader from "../ui/SetupHeader";
import NextButton from "../ui/NextButton";
import { useRef, useEffect } from "react";

// payload shape sent to parent
export type PregnancyPayload = {
  weeksPregnant?: number | null;
  lmpDate?: string | null;
  babyName?: string | null;
  babyGender?: "male" | "female" | "unknown" | "prefer-not-to-say" | null;
};

interface PregnancyProps {
  onComplete?: (data: Record<string, any>) => void;
  fullName?: string;
  email?: string;
}

export default function Pregnancy({
  onComplete,
  fullName,
  email,
}: PregnancyProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [value, setValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [weekError, setWeekError] = useState("");
  const API_BASE = (window as any).__API_URL__ || "http://localhost:3000";

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Updated baby genders to include "Prefer not to say"
  const babyGenders = ["Girl", "Boy", "Unknown", "Prefer not to say"];

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

  const weeksOrLmpFilled =
    (selectedOption === "option1" && value !== "") ||
    (selectedOption === "option2" && selectedDate !== "") ||
    value !== "" ||
    selectedDate !== "";

  const handleNext = async () => {
    // Remove the gender requirement - it's now optional
    // if (!selectedGender) return;

    // normalize gender - handle "Prefer not to say" case
    const genderMap: Record<string, "male" | "female" | "unknown" | "prefer-not-to-say" | null> = {
      Boy: "male",
      Girl: "female",
      Unknown: "unknown",
      "Prefer not to say": "prefer-not-to-say",
    };
    const babyGenderNormalized = selectedGender ? 
      (genderMap[selectedGender] ?? null) : null;

    // convert weeksPregnant value to number if present
    const weeksPregnantNum =
      selectedOption === "option1" && value !== "" ? Number(value) : null; // null if "I don't know"

    // lmpDate should be a proper ISO date string or null (we're reading selectedDate)
    const lmpDate = selectedDate || null;

    // Build canonical payload expected by server
    const payload = {
      stage: "pregnant",
      weeksPregnant: weeksPregnantNum,
      lmpDate,
      babyName: inputValue || null,
      babyGender: babyGenderNormalized,
    };

    console.log("Payload sent to backend:", payload);

    try {
      // save to backend
      const token = localStorage.getItem("token");

      if (token) {
        const res = await fetch(`${API_BASE}/api/mother-profiles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          const msg = await res.text();
          console.error("Failed to save pregnancy data:", msg);
        } else {
          console.log("Pregnancy data saved successfully");
        }
      }

      //  cache locally so Dashboard can show it immediately
      localStorage.setItem("lastStage", "pregnant");
      if (weeksPregnantNum !== null)
        localStorage.setItem("lastWeeksPregnant", String(weeksPregnantNum));
      if (lmpDate) localStorage.setItem("lastLmpDate", lmpDate);
    } catch (err) {
      console.error("Error saving pregnancy profile:", err);
    }

    localStorage.setItem("lastStage", "pregnant");
    if (weeksPregnantNum !== null)
      localStorage.setItem("babyWeeksPregnant", String(weeksPregnantNum));
    if (inputValue) localStorage.setItem("babyName", inputValue);
    localStorage.setItem("babyGender", babyGenderNormalized);

    // notify parent (if any navigation logic uses onComplete)
    onComplete?.(payload);
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
            className="dropdown-container bg-white w-full m-auto rounded-2xl max-h-[80vh] scrollbar-thin overflow-y-auto scrollbar-thumb-white/50 scrollbar-track hover:scrollbar-thumb-white/50 shadow-lg p-10 pb-4 mb-6"
          >
            <div className="text-left">
              <h2 className="text-bloomBlack font-semibold">
                How many weeks pregnant are you?
              </h2>

              {/* Radio options */}
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
                      min="0"
                      value={value}
                      onChange={(val) => {
                        const num = Number(val);

                        if (val === "") {
                          setValue("");
                          setWeekError("");
                        } else if (isNaN(num) || num < 0) {
                          setWeekError("Please enter a valid number");
                        } else {
                          setValue(val);
                          setWeekError("");
                        }
                      }}
                      placeholder="Enter the number of weeks"
                    />
                    {weekError && (
                      <p className="text-red-500 text-sm mt-1">{weekError}</p>
                    )}
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
                    <p className="text-bloomBlack">
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

                {/* Baby's details */}
                <hr className="border-gray-200 my-4 mt-4" />
                <div className="baby-details mt-4">
                  <label>
                    <h2 className="font-semibold text-bloomBlack">
                      Baby's Name (Optional)
                    </h2>
                    <div className="ml-6 mt-3 w-60">
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

                  <label>
                    <h2 className="mt-4 font-semibold text-bloomBlack">
                      Baby's Gender (Optional)
                    </h2>
                  </label>

                  <div className="relative mb-4 w-[350px] ml-6" ref={dropdownRef}>
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
                      <div className="absolute top-full left-0 mt-1 bg-white border border-[#9a9a9a] rounded-lg shadow-lg z-10 w-full">
                        {babyGenders.map((gender) => (
                          <div
                            key={gender}
                            onClick={() => handleGenderSelect(gender)}
                            className={`p-4 hover:bg-bloomWhite transition-colors ${
                              selectedGender === gender
                                ? "bg-bloomWhite text-bloomPink"
                                : "text-bloomBlack"
                            } cursor-pointer`}
                          >
                            {gender}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 ">
                    <NextButton
                      onComplete={handleNext}
                      // Remove gender requirement from isReady condition
                      isReady={weeksOrLmpFilled}
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