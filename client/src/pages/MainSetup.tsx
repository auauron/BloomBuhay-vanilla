import React, { useState, useEffect } from "react";
import "../index.css";
import { CircleArrowLeftIcon } from "lucide-react";
import Pregnancy from "../components/setup/Pregnancy";
import Postpartum from "../components/setup/Postpartum";
import Childbirth from "../components/setup/Childbirth";
import Setup from "./Setup";
import { useSearchParams, useNavigate, useLocation } from "react-router-dom";
import { authService } from "../services/authService";
import { keyToLabel } from "../utils/stages"; 

export default function MainSetup() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<"setup" | "details">("setup");

  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();

  // Get user data from navigation state or fallback to localStorage 
  const stateData = (location.state as any) || {};
  const user = authService.getUser?.();
  const fullName = stateData.fullName || user?.fullName || "";
  const email = stateData.email || user?.email || "";

  useEffect(() => {
    console.log("MainSetup received state:", { fullName, email, fullState: location.state });
  }, [fullName, email, location.state]);

  // Sync state from URL params
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

  const handleStageSelect = (stageKey: string) => {
    setSelectedStage(stageKey);
    setCurrentPage("details");
    setSearchParams({ page: "details", stage: stageKey });
  };

  const handleComplete = async (stageData?: Record<string, any>) => {
    setSearchParams({});

    // persist canonical key locally immediately (optimistic)
    try {
      if (selectedStage) localStorage.setItem("lastStage", selectedStage);
    } catch (e) {
      /* ignore localStorage errors */
    }

    const token = authService.getToken?.() ?? localStorage.getItem("token");

    if (token) {
      try {
        const resp = await fetch("http://localhost:3000/api/mother-profiles", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            stage: selectedStage,
            weeksPregnant: stageData?.weeksPregnant ?? null,
            lmpDate: stageData?.lmpDate ?? null,
            babyName: stageData?.babyName ?? null,
            babyGender: stageData?.babyGender ?? null,
          }),
        });

        console.log("POST /api/mother-profiles status:", resp.status, "ok:", resp.ok);

        // try to read JSON body (defensive)
        const serverBody = await resp.json().catch(() => null);
        console.log("POST /api/mother-profiles body:", serverBody);

        // if server returned a canonical stage, prefer and persist it
        if (serverBody?.stage) {
          try {
            localStorage.setItem("lastStage", String(serverBody.stage));
            if (typeof serverBody.weeksPregnant === "number") {
              localStorage.setItem("lastWeeksPregnant", String(serverBody.weeksPregnant));
            }
          } catch (e) {}
        }

        if (!resp.ok) {
          console.warn("Server responded with non-ok status when saving profile:", resp.status);
        }
      } catch (err) {
        console.error("Could not post profile:", err);
      }
    } else {
      console.warn("No token available — profile not saved server-side, only cached locally.");
    }

    // navigate to dashboard and pass canonical stage in state (so Dashboard can read it immediately)
    navigate("/dashboard", { state: { stage: selectedStage } });
  };

  const handleBack = () => {
    setCurrentPage("setup");
    setSelectedStage(null);
    setSearchParams({ page: "setup" });
  };

  const renderStageComponent = () => {
    switch (selectedStage) {
      case "pregnant":
        return <Pregnancy onComplete={handleComplete} fullName={fullName} email={email} />;
      case "postpartum":
        return <Postpartum onComplete={handleComplete} fullName={fullName} email={email} />;
      case "childcare":
        return <Childbirth onComplete={handleComplete} fullName={fullName} email={email} />;
      default:
        return null;
    }
  };

  const getSubtitle = () => {
    const label = keyToLabel(selectedStage);
    switch (selectedStage) {
      case "pregnant":
        return "Let's begin your pregnancy journey together.";
      case "postpartum":
        return "Let's navigate your postpartum recovery together.";
      case "childcare":
        return "Let's track your baby's growth and development.";
      default:
        return "Let's begin your journey together.";
    }
  };

  if (currentPage === "setup") {
    return <Setup onStageSelect={handleStageSelect} fullName={fullName} email={email} />;
  }

  return (
    <div className="bg-bloomWhite min-h-screen flex flex-col overflow-hidden">
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