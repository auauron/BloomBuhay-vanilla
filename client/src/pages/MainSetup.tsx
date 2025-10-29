import React, { useState } from "react";
import "../index.css";
import { CircleArrowLeftIcon } from "lucide-react";
import Pregnancy from "../components/Pregnancy";
import Postpartum from "../components/Postpartum";
import Childbirth from "../components/Childbirth";
import Setup from "./Setup";

export default function MainSetup() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<"setup" | "details">("setup");

  const handleStageSelect = (stage: string) => {
    setSelectedStage(stage);
    setCurrentPage("details");
  };

  const handleBack = () => {
    setCurrentPage("setup");
    setSelectedStage(null);
  };

  const renderStageComponent = () => {
    switch (selectedStage) {
      case "Pregnant":
        return <Pregnancy />;
      case "Postpartum":
        return <Postpartum />;
      case "Early Childcare":
        return <Childbirth />;
      default:
        return null;
    }
  };

// change subtitle based on stage
  const getSubtitle = () => {
    switch (selectedStage) {
      case "Pregnant":
        return "Let's begin your pregnancy journey together.";
      case "Postpartum":
        return "Let's navigate your postpartum recovery together.";
      case "Early Childcare":
        return "Let's track your baby's growth and development.";
      default:
        return "Let's begin your journey together.";
    }
  };

  if (currentPage === "setup") {
    return <Setup onStageSelect={handleStageSelect} />;
  }

  return (
    <div className="bg-bloomWhite min-h-screen flex flex-col">
      {/* Header */}
      <header className="fixed top-0 left-0 flex flex-row items-center w-full py-4 px-6">
        <div className="flex items-center space-x-4">
          <CircleArrowLeftIcon
            size={32}
            className="cursor-pointer text-bloomWhite fill-bloomPink"
            onClick={handleBack}
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
      <div className="flex-1 flex items-center justify-center px-6 mt-16">
        <div className="p-8 w-full max-w-2xl">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold font-rubik text-bloomBlack mb-1">
              You're blooming beautifully, mama!
            </h1>
            <p className="text-[#474747] font-rubik">
              {getSubtitle()}
            </p>
            {renderStageComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}