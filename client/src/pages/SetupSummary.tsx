// src/pages/SetupSummary.tsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CircleArrowLeftIcon } from "lucide-react";

export default function SetupSummary() {
  const navigate = useNavigate();
  const location = useLocation();
  const data = location.state || {};

  const {
    fullName,
    email,
    motherhoodStage,
    weeksPregnant,
    weeksAfterBirth,
    babyName,
    babyGender,
    babyAgeMonths,
  } = data;

  // Debug: Log the received data
  console.log("SetupSummary received data:", {
    fullName,
    email,
    allData: data,
  });

  const handleStart = () => {
    navigate("/dashboard");
  };

  const handleBack = () => {
    if (motherhoodStage === "Pregnant") {
      navigate("/setup/pregnancy", { state: data });
    } else if (motherhoodStage === "Postpartum") {
      navigate("/setup/postpartum", { state: data });
    } else if (motherhoodStage === "Early Childcare") {
      navigate("/setup/childbirth", { state: data });
    } else {
      navigate("/mainsetup", { state: { fullName, email } });
    }
  };

  const stageDetails = () => {
    if (motherhoodStage === "Pregnant") {
      return (
        <>
          <div>
            <p className="font-semibold">Motherhood Stage</p>
            <p>Pregnant</p>
          </div>
          <div>
            <p className="font-semibold">Weeks Pregnant</p>
            <p>
              {weeksPregnant !== null && weeksPregnant !== undefined
                ? `${weeksPregnant} weeks`
                : "—"}
            </p>
          </div>
        </>
      );
    } else if (motherhoodStage === "Postpartum") {
      return (
        <>
          <div>
            <p className="font-semibold">Motherhood Stage</p>
            <p>Postpartum</p>
          </div>
          <div>
            <p className="font-semibold">Weeks After Birth</p>
            <p>{weeksAfterBirth || "—"} weeks</p>
          </div>
        </>
      );
    } else if (motherhoodStage === "Early Childcare") {
      return (
        <>
          <div>
            <p className="font-semibold">Motherhood Stage</p>
            <p>Early Childcare</p>
          </div>
          <div>
            <p className="font-semibold">Baby's Age</p>
            <p>{babyAgeMonths || "—"} months</p>
          </div>
        </>
      );
    } else {
      return (
        <div>
          <p className="font-semibold">Motherhood Stage</p>
          <p>—</p>
        </div>
      );
    }
  };

  return (
    <div className="bg-bloomWhite min-h-screen flex flex-col items-center justify-center font-rubik relative px-4">
      {/* header */}
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

      <div className="text-center mb-10 mt-16">
        <h2 className="font-poppins text-2xl font-bold text-bloomBlack">
          You're all set!
        </h2>
        <p className="text-gray-600 text-sm">
          Make sure to double-check before you start blooming!
        </p>
      </div>

      {/* Summary card */}
      <div className="bg-white shadow-lg rounded-2xl px-10 py-8 text-bloomBlack w-full max-w-lg">
        <div className="grid grid-cols-2 gap-y-6 text-sm">
          {/* Left column */}
          <div>
            <p className="font-semibold">Name</p>
            <p>{fullName || "—"}</p>
          </div>

          {/* Right column */}
          {stageDetails()}

          <div>
            <p className="font-semibold">Email</p>
            <p>{email || "—"}</p>
          </div>

          <div>
            <p className="font-semibold">Baby's Name</p>
            <p>{babyName || "—"}</p>
          </div>

          <div>
            <p className="font-semibold">Baby's Gender</p>
            <p>{babyGender || "—"}</p>
          </div>
        </div>

        {/* Start Button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={handleStart}
            className=" rounded-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white font-semibold px-8 py-3 shadow-md hover:shadow-lg transition-all"
          >
            Start Blooming
          </button>
        </div>
      </div>
    </div>
  );
}
