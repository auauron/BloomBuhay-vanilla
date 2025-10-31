// src/pages/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../index.css";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import { authService } from "../services/authService";

const API_BASE = (window as any).__API_URL__ || "http://localhost:3000";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const stageFromState = (location.state as { stage?: string } | null)?.stage;
  const searchParams = new URLSearchParams(location.search);
  const stageFromQuery = searchParams.get("stage");

  const [stageFromDb, setStageFromDb] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState(true);

  const [userName, setUserName] = useState<string | null>(null);
  const [weeksPregnant, setWeeksPregnant] = useState<number | null>(null);

  // helper: map enum -> UI label
  const enumToUi = (val: string | null | undefined): string | null => {
    switch (val) {
      case "pregnant":
        return "Pregnant";
      case "postpartum":
        return "Postpartum";
      case "childcare":
        return "Early Childcare";
      default:
        return null;
    }
  };

  useEffect(() => {
    let mounted = true;

    const fetchAll = async () => {
      setLoadingStage(true);

      try {
        const token = authService.getToken() ?? localStorage.getItem("token");
        if (!token) {
          // no token: can't fetch server-side data
          if (mounted) setLoadingStage(false);
          return;
        }

        // Fetch user name
        try {
          const userRes = await fetch(`${API_BASE}/api/users/me`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (userRes.ok) {
            const userJson = await userRes.json();
            // server might return { fullName } or { name } or { user: { fullName } }
            const name =
              userJson.fullName ?? userJson.name ?? userJson.user?.fullName ?? userJson.user?.name;
            if (mounted) setUserName(name ?? null);
          } else {
            // ignore non-ok user fetch (may be 401)
            console.warn("Could not fetch user info:", userRes.status);
          }
        } catch (err) {
          console.error("Failed to fetch user:", err);
        }

        // Fetch mother profile
        try {
          const profRes = await fetch(`${API_BASE}/api/mother-profiles/me`, {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (profRes.status === 401) {
            console.warn("Unauthorized when fetching mother profile");
            if (mounted) setLoadingStage(false);
            return;
          }

          if (profRes.status === 404) {
            // no profile yet
            if (mounted) {
              setStageFromDb(null);
              setWeeksPregnant(null);
            }
          } else if (!profRes.ok) {
            const text = await profRes.text().catch(() => null);
            console.error("Failed to fetch mother profile:", profRes.status, text);
          } else {
            const profile = await profRes.json();
            // profile.stage is enum 'pregnant'|'postpartum'|'childcare'
            if (mounted) {
              setStageFromDb(enumToUi(profile.stage));
              // server field may be weeksPregnant or weeks_pregnant — try common names
              const wp =
                profile.weeksPregnant ??
                profile.weeks_pregnant ??
                profile.weeks_pregnancy ??
                profile.weeks;
              setWeeksPregnant(typeof wp === "number" ? wp : null);
              // also update optimistic cache
              try {
                if (profile.stage) localStorage.setItem("lastStage", enumToUi(profile.stage) ?? "");
                if (typeof wp === "number") localStorage.setItem("lastWeeksPregnant", String(wp));
              } catch (e) {
                // ignore localStorage errors
              }
            }
          }
        } catch (err) {
          console.error("Failed to fetch mother profile:", err);
        }
      } finally {
        if (mounted) setLoadingStage(false);
      }
    };

    fetchAll();

    return () => {
      mounted = false;
    };
  }, []);

  // fallback to optimistic cache if DB hasn't provided anything
  const cachedStage = localStorage.getItem("lastStage");
  const cachedWeeks = Number(localStorage.getItem("lastWeeksPregnant") ?? NaN);
  const effectiveWeeks = weeksPregnant ?? (Number.isInteger(cachedWeeks) ? cachedWeeks : null);

  // Final stage selection order: route state -> query -> db -> cached -> null
  const stage = stageFromState ?? stageFromQuery ?? stageFromDb ?? (cachedStage || null);

  // optional: show a tiny loading indicator while determining stage
  if (loadingStage) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading personalized dashboard…</p>
      </div>
    );
  }

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderMainCard = () => {
    switch (stage) {
      case "Pregnant":
        return (
          <>
            <h3 className="text-2xl font-bold mb-2">You are now</h3>
            <h1 className="text-4xl font-extrabold leading-tight text-[#474747]">
              {/* show weeks and optionally days if you have them */}
              {effectiveWeeks !== null ? `${effectiveWeeks} weeks` : "— weeks"}
            </h1>
            <p className="text-2xl font-semibold mb-6">pregnant.</p>
            <p className="text-white/90 text-xl absolute bottom-8 font-rubik font-light">
              Your baby is as big as a <span className="font-bold">tomato!</span>
            </p>
          </>
        );
      case "Postpartum":
        return (
          <>
            <h3 className="text-2xl font-bold mb-2">Postpartum stage</h3>
            <h1 className="text-3xl font-extrabold leading-tight text-[#474747]">
              Welcome to your recovery journey
            </h1>
            <p className="text-lg font-semibold mb-6">
              Tips and self-care for the first weeks
            </p>
            <p className="text-white/90 text-xl absolute bottom-8 font-rubik font-light">
              Rest when you can — you’re doing great, mama.
            </p>
          </>
        );
      case "Early Childcare":
        return (
          <>
            <h3 className="text-2xl font-bold mb-2">Early Childcare</h3>
            <h1 className="text-3xl font-extrabold leading-tight text-[#474747]">
              Track your baby's growth
            </h1>
            <p className="text-lg font-semibold mb-6">
              Feeding, sleep, and developmental milestones
            </p>
            <p className="text-white/90 text-xl absolute bottom-8 font-rubik font-light">
              Small wins every day — celebrate every milestone.
            </p>
          </>
        );
      default:
        return (
          <>
            <h3 className="text-2xl font-bold mb-2">Welcome</h3>
            <h1 className="text-3xl font-extrabold leading-tight text-[#474747]">
              Let’s get you set up
            </h1>
            <p className="text-lg font-semibold mb-6">
              Complete your setup to get personalized tips
            </p>
            <p className="text-white/90 text-xl absolute bottom-8 font-rubik font-light">
              Choose your stage to start getting tailored content.
            </p>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col font-poppins">
      <Header onMenuClick={toggleSidebar} />
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      {/* Greeting */}
      <div className="flex flex-col items-center text-center mt-8 px-4">
        <h2 className="text-4xl font-bold text-bloomPink">
          Hello, {userName ? `Mama ${userName}` : "Mama"}!
          {stage && (
            <span className="text-lg font-medium text-[#474747] ml-3">— {stage}</span>
          )}
        </h2>
        <p className="text-[#474747] font-rubik mt-2 mb-[-5px] font-light text-lg">
          “One day at a time, one heartbeat at a time — you are growing a miracle.”
        </p>
      </div>

      {/* Dashboard Layout */}
      <div className="grid grid-cols-1 md:grid-cols-[550px_1fr] gap-6 p-8 max-w-6xl mx-auto w-full">
        {/* Left Info Card (content varies by stage) */}
        <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-8 rounded-[20px] shadow-lg relative">
          {renderMainCard()}
          <div className="absolute bottom-6 right-6 h-40 w-40 bg-white/80 rounded-full border-8 border-white"></div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-6">
          {/* Progress */}
          <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] text-pink-800 p-6 rounded-[20px] shadow-md font-semibold">
            <h3 className="text-2xl mb-2 text-white font-bold">Progress</h3>
            <div className="w-full bg-white/60 rounded-full h-5 mt-3 overflow-hidden">
              <div className="bg-[#DE085F] h-full w-1/3 rounded-full"></div>
            </div>
            <p className="mt-2 text-lg text-center text-[#DE085F] font-bold">17% complete</p>
            <p className="mt-2 text-lg text-[#474747] font-rubik font-light">
              <span className="font-bold">Remaining:</span> 83% (33 weeks, 2 days)
            </p>
            <p className="mt-2 text-lg text-[#474747] font-rubik font-light">
              <span className="font-bold">Due Date:</span> January 15, 2024
            </p>
          </div>

          {/* To-do + Tips side by side */}
          <div className="grid grid-cols-2 gap-4">
            {/* To-do */}
            <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] p-6 rounded-[20px] shadow-md">
              <h3 className="text-2xl mb-3 text-white font-bold">To do</h3>
              <ul className="space-y-2 text-sm text-[#474747]">
                <li className="font-rubik">
                  <input type="checkbox" className="accent-[#DE085F] mr-2" />
                  Schedule checkup
                </li>
                <li className="font-rubik">
                  <input type="checkbox" className="accent-[#DE085F] mr-2" />
                  Ask OB about safe medications for morning sickness
                </li>
              </ul>
            </div>

            {/* Tips */}
            <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] text-pink-800 p-6 rounded-[20px] shadow-md">
              <h3 className="text-2xl mb-3 text-white font-bold">Tips</h3>
              <p className="text-sm text-[#474747] font-rubik">
                Drink plenty of water 💧 and take short naps when you feel tired.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}