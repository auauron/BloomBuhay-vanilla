import React, { useState } from "react";
import "../index.css";
import { CircleArrowLeftIcon, ChevronDownIcon } from "lucide-react";

export default function Setup() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStage, setSelectedStage] = useState("");

  const motherhoodStages = ["Pregnant", "Postpartum", "Early Childcare"];

  const handleStageSelect = (stage) => {
    setSelectedStage(stage);
    setIsOpen(false);
  };

  return (
    <div className=" bg-[#FFF6F6] min-h-screen flex flex-col">
      {/* Header */}

      <header className="setup-container p-10 flex flex-row items-center w-full py-4 px-6">
        <div className="flex items-center p-10 space-x-8">
          <CircleArrowLeftIcon
            size={32}
            className="back-button cursor-pointer mr-8 text-[#FFF6F6] fill-[#F875AA]"
          />
          <h1 className="text-xl font-semibold text-[#F875AA]">BloomBuhay</h1>
        </div>

        <img
          src="/assets/logo_pink.png"
          alt="Logo"
          style={{ width: "40px", height: "40px" }}
          className="object-contain"
        />
      </header>

      {/* Main content */}
      <div className="main-container flex-1 flex items-center justify-center px-6">
        <div className="shadow-lg p-8 max-w-md w-full">
          <div className="text-center mb-8">
            <h1 className="intro text-2xl font-bold font-rubik text-[#474747] mb-1">
              Let's get you started!
            </h1>
            <p className="text-[#474747]">
              We'd like to get to know more about you.
            </p>
          </div>

          <div className="dropdown-container rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="question text-[#474747]">
              Which stage of motherhood best describes you right now?
            </h2>

            <div className="relative">
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
                className={`next-button w-full py-3 rounded-lg font-semibold transition-colors ${
                  selectedStage
                    ? "cursor-pointer"
                    : "cursor-not-allowed"
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
  );
}
