// src/components/Pregnancy.tsx
import React, { useState } from "react";
import { ChevronDownIcon } from "lucide-react";
import InputField from "../ui/inputField";
import SetupHeader from "../ui/SetupHeader";
import { authService } from "../../services/authService"; // adjust path if needed

interface PregnancyProps {
  onComplete?: () => void; // no payload — we save ourselves
}

export default function Pregnancy({ onComplete }: PregnancyProps) {
  const [selectedOption, setSelectedOption] = useState("");
  const [value, setValue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedGender, setSelectedGender] = useState("");
  const [loading, setLoading] = useState(false);

  const babyGenders = ["Girl", "Boy", "Unknown"];
  const API_BASE = (window as any).__API_URL__ || "http://localhost:3000";

  const handleGenderSelect = (gender: string) => {
    setSelectedGender(gender);
    setIsOpen(false);
  };

  const handleOptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedOption(e.target.value);
  };

  // Central save function: calls POST /api/mother-profiles with weeksPregnant (and other fields)
  const saveProfile = async () => {
    // require gender as before
    if (!selectedGender) return;

    setLoading(true);
    try {
      const token = authService.getToken() ?? localStorage.getItem("token");

      const body: any = {
        stage: "Pregnant", // UI label expected by your server mapping
        weeksPregnant: value ? Number(value) : null,
        lmpDate: selectedDate || null,
        babyName: inputValue || null,
        babyGender: selectedGender
          ? selectedGender.toLowerCase() === "girl"
            ? "female"
            : selectedGender.toLowerCase() === "boy"
            ? "male"
            : "unknown"
          : null,
      };

      // optimistic cache so dashboard shows immediately even if network fails
      try {
        if (body.weeksPregnant != null) localStorage.setItem("lastWeeksPregnant", String(body.weeksPregnant));
        localStorage.setItem("lastStage", "Pregnant");
      } catch (err) {
        // ignore storage errors
      }

      if (!token) {
        console.warn("No auth token found — saving locally only.");
        // no server call, just proceed to next
        onComplete?.();
        return;
      }

      const resp = await fetch(`${API_BASE}/api/mother-profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!resp.ok) {
        const errJson = await resp.json().catch(() => null);
        console.error("Failed saving mother profile:", resp.status, errJson);
        // still proceed (we cached optimistically)
      } else {
        const created = await resp.json().catch(() => null);
        // update cache with server-authoritative value if available
        if (created?.weeksPregnant != null) {
          try {
            localStorage.setItem("lastWeeksPregnant", String(created.weeksPregnant));
          } catch {}
        }
      }
    } catch (err) {
      console.error("Network error saving mother profile:", err);
    } finally {
      setLoading(false);
      onComplete?.(); // move to dashboard (MainSetup handles navigation)
    }
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

              <div className="radio-btn">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="radioGroup"
                    value="option1"
                    checked={selectedOption === "option1"}
                    onChange={handleOptionChange}
                    className="w-3 h-3 ..."
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
                    className="w-3 h-3 ..."
                  />
                  <div className="flex-1">
                    <h2 className="text-bloomBlack font-semibold">I don't know.</h2>
                    <p className="text-bloomBlack ">
                      Don't worry. We can estimate it for you! When was your last menstrual period?
                    </p>
                    <div className="w-60 mt-2">
                      <InputField label="" type="date" value={selectedDate} onChange={setSelectedDate} placeholder="Select the date" />
                    </div>
                  </div>
                </label>

                <hr className="border-gray-200 my-4" />

                <div className="baby-details">
                  <label>
                    <h2 className="font-semibold text-bloomBlack">Baby's Name</h2>
                    <div className="ml-4 mt-3 w-60">
                      <InputField label="" type="text" value={inputValue} onChange={setInputValue} placeholder="Enter your baby's name" />
                    </div>
                  </label>

                  <label>
                    <h2 className="mt-4 font-semibold text-bloomBlack">Baby's Gender</h2>
                  </label>

                  <div className="relative mb-4 w-[350px] ml-4">
                    <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between p-4 mt-4 border-gray-300 border rounded-lg bg-white hover:border-[#F875AA] transition-colors text-left w-full" type="button">
                      <span className={selectedGender ? "text-bloomBlack" : "text-[#9a9a9a]"}>{selectedGender || "What's your baby's gender?"}</span>
                      <ChevronDownIcon size={20} className={`text-[#9a9a9a] transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>

                    {isOpen && (
                      <div className="dropdown-menu absolute top-full left-0 mt-1 bg-white border border-[#9a9a9a] rounded-lg shadow-lg z-10 w-full">
                        {babyGenders.map((gender) => (
                          <div key={gender} onClick={() => handleGenderSelect(gender)} className={`choices p-4 hover:bg-bloomWhite transition-colors ${selectedGender === gender ? "bg-bloomWhite text-bloomPink" : "text-bloomBlack"}`} role="button" tabIndex={0}>
                            {gender}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Save -> API call -> then call parent onComplete */}
                    <button
                      type="button"
                      onClick={saveProfile}
                      className="w-full mt-4 rounded-lg bg-bloomPink text-white py-3 font-semibold disabled:opacity-50"
                      disabled={!selectedGender || loading}
                    >
                      {loading ? "Saving..." : "Next"}
                    </button>
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
