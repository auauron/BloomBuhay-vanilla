// src/components/Pregnancy.tsx
import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import InputField from "../ui/inputField";
import SetupHeader from "../ui/SetupHeader";
import NextButton from "../ui/NextButton";
import { useRef, useEffect } from "react";
import { API_BASE_URL } from "../../config";

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

export default function Pregnancy({ onComplete }: PregnancyProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [value, setValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [weekError, setWeekError] = useState("");

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

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  const weeksOrLmpFilled =
    (selectedOption === "option1" && value !== "" && !weekError) ||
    (selectedOption === "option2" && selectedDate !== "");

  const handleNext = async () => {
    // Remove the gender requirement - it's now optional
    // if (!selectedGender) return;

    // normalize gender - handle "Prefer not to say" case
    const genderMap: Record<
      string,
      "male" | "female" | "unknown" | "prefer-not-to-say" | null
    > = {
      Boy: "male",
      Girl: "female",
      Unknown: "unknown",
      "Prefer not to say": "prefer-not-to-say",
    };
    const babyGenderNormalized = selectedGender
      ? genderMap[selectedGender] ?? null
      : null;

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

    try {
      // save to backend
      const token = localStorage.getItem("token");

      if (token) {
        const res = await fetch(`${API_BASE_URL}/api/mother-profiles`, {
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
    localStorage.setItem("babyGender", babyGenderNormalized ?? "");

    // notify parent (if any navigation logic uses onComplete)
    onComplete?.(payload);
  };

  return (
    <div className="flex min-h-screen justify-center relative w-full scrollbar-thin overflow-y-auto scrollbar-thumb-white/50 scrollbar-track hover:scrollbar-thumb-white/50">
      <div className="flex flex-col w-auto py-6 bg-white rounded-2xl shadow-md h-[75vh] p-4 pl-6 mt-4">
        
        {/* pregnancy details*/}
        <div className="flex flex-col gap-6 ">
          <h2 className="text-bloomPink text-xl font-bold text-left">
            How many weeks pregnant are you?
          </h2>
          {/* option 1 */}
          <div className="flex flex-row gap-12 ml-4">
            <label className="flex items-start gap-2">
              <input
                type="radio"
                name="radioGroup"
                value="option1"
                checked={selectedOption === "option1"}
                onChange={handleOptionChange}
                className="w-3 h-3 mt-1 focus:ring-bloomPink focus:ring-2 focus:ring-opacity-50 rounded-full 
            checked:bg-bloomPink checked:border-bloomPink appearance-none focus:outline-none border-2"
              />
              <div className="flex flex-col">
                <h2 className="text-bloomBlack font-semibold text-left">
                  I know!
                </h2>
                <div className="w-[270px] mt-2">
                  <InputField
                    label=""
                    type="number"
                    min="0"
                    max="40"
                    value={value}
                    onChange={(val) => {
                      const num = Number(val);
                      if (val === "") {
                        setValue("");
                        setWeekError("");
                      } else if (isNaN(num) || num < 0) {
                        setWeekError("Please enter a valid number");
                      } else if (num > 40) {
                        setWeekError(
                          "Pregnancy typically lasts up to 40 weeks"
                        );
                        setValue("40");
                      } else {
                        setValue(val);
                        setWeekError("");
                      }
                    }}
                    placeholder="Enter the number of weeks (max 40)"
                  />
                  {weekError && (
                    <p className="text-red-500 text-sm mt-1">{weekError}</p>
                  )}
                </div>
              </div>
            </label>

            {/* option 2 */}
            <label className="flex items-start gap-2 ">
              <input
                type="radio"
                name="radioGroup"
                value="option2"
                checked={selectedOption === "option2"}
                onChange={handleOptionChange}
                className="w-3 h-3 mt-1 focus:ring-bloomPink focus:ring-2 focus:ring-opacity-50 rounded-full 
            checked:bg-bloomPink checked:border-bloomPink appearance-none focus:outline-none border-2"
              />
              <div className="flex flex-col">
                <h2 className="text-bloomBlack font-semibold text-left">
                  I don't know. (Enter your last menstrual period)
                </h2>
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
          </div>
        </div>

        {/* baby details */}
        <div className="flex flex-col gap-6 mt-8">
          <h2 className="text-bloomPink text-xl font-bold text-left">
            Baby's Information
          </h2>

          {/* input fields */}

          <label className="flex flex-col ml-4">
            <h2 className="font-semibold text-bloomBlack text-left ml-4">
              Baby's Name (Optional)
            </h2>
            <div className="ml-6 mt-3 mb-1 w-[300px]">
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

          <label className="flex flex-col ml-4 ">
            <h2 className="font-semibold text-bloomBlack text-left ml-4">
              Baby's Gender (Optional)
            </h2>
          </label>

          <select
            value={selectedGender}
            onChange={(e) => setSelectedGender(e.target.value)}
            className=" ml-10 p-4 border border-gray-300 rounded-lg bg-white hover:border-[#F875AA] text-bloomBlack w-[300px]"
          >
            <option value="">What's your baby's gender?</option>
            {babyGenders.map((gender) => (
              <option key={gender} value={gender}>
                {gender}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="ml-4 fixed bottom-4 right-12 z-50">
        <NextButton
          onComplete={handleNext}
          // Remove gender requirement from isReady condition
          isReady={weeksOrLmpFilled}
        />
      </div>
    </div>
  );
}
