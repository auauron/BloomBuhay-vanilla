import React, { useState, useEffect } from "react";
import "../index.css";
import { CircleArrowLeftIcon } from "lucide-react";
import Pregnancy from "../components/setup/Pregnancy";
import Postpartum from "../components/setup/Postpartum";
import Childbirth from "../components/setup/Childbirth";
import Setup from "./Setup";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function MainSetup() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<"setup" | "details">("setup");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  // Sync state from URL params so route and UI stay consistent
  useEffect(() => {
    const page = searchParams.get("page");
    const stage = searchParams.get("stage");

    if (page === "details") {
      setCurrentPage("details");
      setSelectedStage(stage);
    } else {
      setCurrentPage("setup");
      setSelectedStage(null);
    }
  }, [searchParams]);

  const handleStageSelect = (stage: string) => {
    // update local state and push params to URL
    setSelectedStage(stage);
    setCurrentPage("details");
    setSearchParams({ page: "details", stage });
  };

  const handleComplete = async (stage?: string) => {
    const uiStage = stage ?? selectedStage;

    // if nothing selected, just navigate (shouldn't happen normally)
    if (!uiStage) {
      setSearchParams({});
      navigate("/dashboard", { state: { stage: uiStage } });
      return;
    }

    try {
      // prefer a stored token from login/signup
      const token = localStorage.getItem("token");

      if (!token) {
        // quick/dev fallback: if there's no token, we can't save server-side
        console.warn("No token found in localStorage; profile will NOT be saved.");
        setSearchParams({});
        navigate("/dashboard", { state: { stage: uiStage } });
        return;
      }

      const resp = await fetch("http://localhost:3000/api/mother-profiles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ stage: uiStage }),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => null);
        console.error("Failed creating mother profile:", err);
        // optional: show a toast or block navigation if you prefer
      } else {
        console.log("Stage saved to DB");
      }
    } catch (error) {
      console.error("Error saving stage:", error);
    } finally {
      // clear params and go to dashboard with the UI stage in state
      setSearchParams({});
      navigate("/dashboard", { state: { stage: uiStage } });
    }
  };

  const handleBack = () => {
    setCurrentPage("setup");
    setSelectedStage(null);
    setSearchParams({ page: "setup" });
  };

  const renderStageComponent = () => {
    switch (selectedStage) {
      case "Pregnant":
        // pass onComplete so Pregnancy can call it after successful submit
        return <Pregnancy onComplete={() => handleComplete("Pregnant")} />;
      case "Postpartum":
        return <Postpartum onComplete={() => handleComplete("Postpartum")} />;
      case "Early Childcare":
        return (
          <Childbirth onComplete={() => handleComplete("Early Childcare")} />
        );
      default:
        return null;
    }
  };

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
      <header className="fixed top-0 left-0 flex flex-row items-center shadow-none bg-bloomWhite w-full py-4 px-6">
        <div className="flex items-center space-x-4">
          <CircleArrowLeftIcon
            size={32}
            className="cursor-pointer text-bloomWhite fill-bloomPink"
            onClick={handleBack}
          />
          <h1 className="text-3xl font-bold text-bloomPink">BloomBuhay</h1>
          <img
            src="/assets/logo_pink.png"
            alt="Logo"
            style={{ width: "34px", height: "34px" }}
            className="object-contain"
          />
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-6 mt-16">
        <div className="p-8 w-full max-w-2xl">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold font-rubik text-bloomBlack mb-1">
              You're blooming beautifully, mama!
            </h1>
            <p className="text-[#474747] font-rubik">{getSubtitle()}</p>
            {renderStageComponent()}
          </div>
        </div>
      </div>
    </div>
  );
}