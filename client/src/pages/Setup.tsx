import React, { useState } from "react";
import "../index.css";
import { CircleArrowLeftIcon, ChevronDownIcon } from "lucide-react";

export default function Setup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");

  const motherhoodStages = ["Pregnant", "Postpartum", "Early Childcare"];

  const handleStageSelect = (stage: string) => {
    setSelectedStage(stage);
    setIsOpen(false);
  };

  return (
    <div className=" bg-bloomWhite min-h-screen flex flex-col">
      {/* Header */}

      <header className="fixed top-0 left-0 flex flex-row items-center w-full py-4 px-6">
        <div className="flex items-center space-x-4">
          <CircleArrowLeftIcon
            size={32}
            className="cursor-pointer text-bloomWhite fill-bloomPink"
          />
          <h1 className="text-3xl font-bold text-bloomPink">BloomBuhay</h1>
        </div>

        <img
          src="/assets/logo_pink.png"
          alt="Logo"
          style={{ width: "34px", height: "34px" }}
          className="object-contain"
        />
      </header>

      {/* Main content */}
      <div className="main-container flex-1 flex items-center justify-center px-6">
        <div style={{maxWidth: '800px'}}className="p-8 w-full">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold font-rubik text-bloomBlack mb-1">
              Let's get you started!
            </h1>
            <p className="text-[#474747]">
              We'd like to get to know more about you.
            </p>
          </div>

          <div className="flex justify-center">
            <div style={{ maxWidth: '700px'}}className="dropdown-container bg-white w-full m-auto rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-bloomBlack mb-4">
                Which stage of motherhood best describes you right now?
              </h2>

              <div className="relative mb-4">
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="dropdown w-full flex items-center justify-between p-4 border border-gray-300 rounded-lg bg-white hover:border-[#F875AA] transition-colors cursor-pointer text-left"
                >
                  <span
                    className={
                      selectedStage ? "text-[#474747]" : "text-[#9a9a9a]"
                    }
                  >
                    {selectedStage || "Select a stage"}
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
                    {motherhoodStages.map((stage: string, index: number) => (
                      <div
                        key={stage}
                        onClick={() => handleStageSelect(stage)}
                        className={`choices p-4 cursor-pointer hover:bg-[#FFF6F6] transition-colors ${
                          index !== motherhoodStages.length - 1 ? "" : ""
                        } ${
                          selectedStage === stage
                            ? "bg-[#FFF6F6] text-[#F875AA]"
                            : "text-[#474747]"
                        }`}
                      >
                        {stage}
                      </div>
                    ))}
                  </div>
                )}

                {/* Next button */}
                <button
                  className={`next-button w-full rounded-lg font-semibold transition-colors ${
                    selectedStage ? "cursor-pointer" : "cursor-not-allowed"
                  }`}
                  disabled={!selectedStage}
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
