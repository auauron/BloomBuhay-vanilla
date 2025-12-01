import React, { useState } from "react";
import InputField from "../ui/inputField";
import NextButton from "../ui/NextButton";
import { API_BASE_URL } from "../../config";

const API_BASE = API_BASE_URL;

interface ChildbirthProps {
  onComplete?: (data: Record<string, any>) => void;
  fullName?: string;
  email?: string;
}

export default function Childbirth({
  onComplete,
}: ChildbirthProps) {
  const [value, setValue] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [ageError, setAgeError] = useState("");

  const babyGenders = ["Girl", "Boy"];

  const handleNext = async () => {
    // basic validation: require a selected gender (matches other components)
    if (!selectedGender) return;

    // normalize gender to server enum: male | female | unknown
    const genderMap: Record<string, "male" | "female" | "unknown"> = {
      Boy: "male",
      Girl: "female",
    };
    const babyGenderNormalized = (genderMap[selectedGender] ?? "unknown") as
      | "male"
      | "female"
      | "unknown";

    // convert age value to number if present
    const babyAgeMonthsNum =
      value !== "" && !Number.isNaN(Number(value)) ? Number(value) : null;

    // Build canonical payload expected by parent/server
    const stageData = {
      stage: "childcare", // canonical key (server expects 'childcare')
      babyName: inputValue || null,
      babyGender: babyGenderNormalized,
      babyAgeMonths: babyAgeMonthsNum,
    };

    // save to backend
    try {
      const token = localStorage.getItem("token");

      if (token) {
        await fetch(`${API_BASE}/api/mother-profiles`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(stageData),
        });
      }
    } catch (err) {
      console.error("Failed to save childcare data:", err);
    }

    // inform parent (MainSetup) that setup is complete and navigate to dashboard
    onComplete?.(stageData);
  };

  return (
    <div className="flex min-h-screen justify-center relative w-full scrollbar-thin overflow-y-auto scrollbar-thumb-white/50 scrollbar-track hover:scrollbar-thumb-white/50">
      <div className="flex flex-col w-[110vh] py-6 bg-white rounded-2xl shadow-md h-[75vh] p-4 pl-6 mt-4">
        <div className="flex flex-col gap-6">
          <h2 className="text-bloomPink text-xl font-bold text-left">
            Baby's Information
          </h2>

          {/* input fields */}

          <label className="flex flex-col ml-4">
            <h2 className="font-semibold text-bloomBlack text-left ml-4">
              Baby's Name
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

          <label className="flex flex-col ml-4">
            <h2 className="font-semibold text-bloomBlack text-left mt-4 pl-4">
              Baby's Age
            </h2>
            <div className="ml-4 w-[320px] m-4">
              <InputField
                label=""
                type="number"
                min="0"
                value={value}
                onChange={(val) => {
                  const num = Number(val);

                  if (val === "") {
                    setValue("");
                    setAgeError("");
                  } else if (isNaN(num) || num < 0) {
                    setAgeError("Please enter a valid number");
                  } else {
                    setValue(val);
                    setAgeError("");
                  }
                }}
                placeholder="Enter your baby's age in months"
              />
              {ageError && (
                <p className="text-red-500 text-sm mt-1">{ageError}</p>
              )}
            </div>
          </label>

          <label className="flex flex-col ml-4 ">
            <h2 className="font-semibold text-bloomBlack text-left ml-4">
              Baby's Gender
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
          isReady={Boolean(inputValue && value && selectedGender)}
        />
      </div>
    </div>
  );
}
