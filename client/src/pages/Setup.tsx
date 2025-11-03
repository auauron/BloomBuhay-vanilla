import React, { useState } from "react";
import "../index.css";
import { ChevronDownIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SetupHeader from "../components/ui/SetupHeader";

interface SetupProps {
  onStageSelect: (stageKey: string) => void;
  fullName?: string;
  email?: string;
}

export default function Setup({ onStageSelect, fullName, email }: SetupProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStageKey, setSelectedStageKey] = useState<string>("");

  const motherhoodStages = [
    { key: "pregnant", label: "Pregnant" },
    { key: "postpartum", label: "Postpartum" },
    { key: "childcare", label: "Early Childcare" },
  ];

  const navigate = useNavigate();

  const handleStageSelect = (stageKey: string) => {
    setSelectedStageKey(stageKey);
    setIsOpen(false);
  };

  const handleNext = () => {
    if (!selectedStageKey) return;
    onStageSelect(selectedStageKey);
    setIsOpen(false);
  };

  const selectedLabel =
    motherhoodStages.find((s) => s.key === selectedStageKey)?.label || "";

  return (
    <div className="bg-bloomWhite min-h-screen flex flex-col">
      <SetupHeader onBackClick={() => navigate(-1)} />

      <div className="main-container flex-1 flex items-center justify-center px-6 mt-16">
        <div style={{ maxWidth: "800px" }} className="p-8 w-full">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold font-rubik text-bloomBlack mb-1">
              Let's get you started!
            </h1>
            <p className="text-[#474747]">We'd like to get to know more about you.</p>

            {/* Optional: show prefilled name/email if available */}
            {(fullName || email) && (
              <p className="text-sm text-[#6b6b6b] mt-2">
                {fullName && <span>{fullName}</span>}
                {fullName && email && <span> • </span>}
                {email && <span>{email}</span>}
              </p>
            )}
          </div>

          <div className="flex justify-center">
            <div
              style={{ maxWidth: "700px" }}
              className="dropdown-container bg-white w-full m-auto rounded-2xl shadow-lg p-6 mb-8"
            >
              <h2 className="text-bloomBlack mb-4">
                Which stage of motherhood best describes you right now?
              </h2>

              <div className="relative mb-4">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="dropdown w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white hover:border-[#F875AA] transition-colors cursor-pointer text-left"
                  type="button"
                >
                  <span className={selectedLabel ? "text-bloomBlack" : "text-[#9a9a9a]"}>
                    {selectedLabel || "Select a stage"}
                  </span>
                  <ChevronDownIcon
                    size={20}
                    className={`text-[#9a9a9a] transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {isOpen && (
                  <div className="dropdown-menu absolute top-full left-0 right-0 mt-1 bg-white border border-[#9a9a9a] rounded-lg shadow-lg z-10">
                    {motherhoodStages.map((stage) => (
                      <div
                        key={stage.key}
                        onClick={() => handleStageSelect(stage.key)}
                        className={`choices p-4 cursor-pointer hover:bg-[#FFF6F6] transition-colors ${
                          selectedStageKey === stage.key ? "bg-bloomWhite text-bloomPink" : "text-bloomBlack"
                        }`}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") handleStageSelect(stage.key);
                        }}
                      >
                        {stage.label}
                      </div>
                    ))}
                  </div>
                )}

                <button
                  onClick={handleNext}
                  className={`next-button w-full rounded-lg font-semibold transition-colors text-center justify-center flex mt-6 ${
                    selectedStageKey ? "cursor-pointer bg-bloomPink text-white hover:bg-pink-600" : "bg-gray-300 text-gray-500"
                  }`}
                  disabled={!selectedStageKey}
                  type="button"
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
