import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../index.css";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import { authService } from "../services/authService";
import { motion } from "framer-motion";
import PostpartumTip from "../components/ui/postpartumTips";

const API_BASE = (window as any).__API_URL__ || "http://localhost:3000";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Accept either `state.stage` or `state.motherhoodStage` (some flows use motherhoodStage)
  const stateAny = (location.state as any) ?? {};
  const stageFromState =
    (stateAny.stage as string | undefined) ??
    (stateAny.motherhoodStage as string | undefined) ??
    null;

  const searchParams = new URLSearchParams(location.search);
  const stageFromQuery = searchParams.get("stage"); // canonical key expected

  const [stageFromDb, setStageFromDb] = useState<string | null>(null); // will store canonical key
  const [loadingStage, setLoadingStage] = useState(true);

  const [userName, setUserName] = useState<string | null>(null);
  const [weeksPregnant, setWeeksPregnant] = useState<number | null>(null);

  // baby size fruits
  const babySizeFruits: { maxWeek: number; name: string; image: string }[] = [
    { maxWeek: 4, name: "Poppy Seed", image: "assets/dashboardFruit/Poppy_seed.png" },
    { maxWeek: 5, name: "Sesame Seed", image: "assets/dashboardFruit/Sesame.png" },
    { maxWeek: 6, name: "Lentil Seed", image: "assets/dashboardFruit/Lentil.png" },
    { maxWeek: 7, name: "Blueberry", image: "assets/dashboardFruit/Blueberry.png" },
    { maxWeek: 8, name: "Raspberry", image: "assets/dashboardFruit/Poppy_seed.png" },
    { maxWeek: 9, name: "Grape", image: "assets/dashboardFruit/Grape.png" },
    { maxWeek: 10, name: "Date", image: "assets/dashboardFruit/Dates.png" },
    { maxWeek: 11, name: "Lime", image: "assets/dashboardFruit/Lime.png" },
    { maxWeek: 12, name: "Plum", image: "assets/dashboardFruit/Plum.png" },
    { maxWeek: 13, name: "Kiwi", image: "assets/dashboardFruit/Kiwi.png" },
    { maxWeek: 14, name: "Peach", image: "assets/dashboardFruit/Peach.png" },
    { maxWeek: 15, name: "Pear", image: "assets/dashboardFruit/Pear.png" },
    { maxWeek: 16, name: "Avocado", image: "assets/dashboardFruit/Avocado.png" },
    { maxWeek: 17, name: "Naval Orange", image: "assets/dashboardFruit/Naval_orange.png" },
    { maxWeek: 18, name: "Pomegranate", image: "assets/dashboardFruit/Pomegranate.png" },
    { maxWeek: 19, name: "Grapefruit", image: "assets/dashboardFruit/Grapefruit.png" },
    { maxWeek: 20, name: "Mango", image: "assets/dashboardFruit/Mango.png" },
    { maxWeek: 21, name: "Rockmelon", image: "assets/dashboardFruit/Rockmelon.png" },
    { maxWeek: 24, name: "Eggplant", image: "assets/dashboardFruit/Eggplant.png" },
    { maxWeek: 28, name: "Papaya", image: "assets/dashboardFruit/Papaya.png" },
    { maxWeek: 36, name: "Honeydew", image: "assets/dashboardFruit/Honeydew.png" },
    { maxWeek: 40, name: "Watermelon", image: "assets/dashboardFruit/Watermelon.png" },
  ];

  //helper to pick fruit
  const getFruitByWeek = (week: number | null) => {
    if (week === null) return null;
    return (
      babySizeFruits.find((f) => week <= f.maxWeek) ??
      babySizeFruits[babySizeFruits.length - 1]
    );
  };

  // helper: map canonical enum -> UI label
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
            const name =
              userJson.fullName ??
              userJson.name ??
              userJson.user?.fullName ??
              userJson.user?.name;
            if (mounted) setUserName(name ?? null);
          } else {
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
            console.error(
              "Failed to fetch mother profile:",
              profRes.status,
              text
            );
          } else {
            const profile = await profRes.json();
            // profile.stage is enum 'pregnant'|'postpartum'|'childcare' (canonical)
            if (mounted) {
              setStageFromDb(profile.stage ?? null); // store canonical key
              const wp =
                profile.weeksPregnant ??
                profile.weeks_pregnant ??
                profile.weeks_pregnancy ??
                profile.weeks;
              setWeeksPregnant(typeof wp === "number" ? wp : null);

              // update optimistic cache using canonical key
              try {
                if (profile.stage)
                  localStorage.setItem("lastStage", String(profile.stage));
                if (typeof wp === "number")
                  localStorage.setItem("lastWeeksPregnant", String(wp));
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
  const cachedStage = localStorage.getItem("lastStage"); // cached canonical key
  const cachedWeeks = Number(localStorage.getItem("lastWeeksPregnant") ?? NaN);
  const effectiveWeeks =
    weeksPregnant ?? (Number.isInteger(cachedWeeks) ? cachedWeeks : null);

  // Final stage selection order (canonical key): route state -> query -> db -> cached -> null
  const canonicalStageKey =
    stageFromState ?? stageFromQuery ?? stageFromDb ?? (cachedStage || null);

  // readable label for UI
  const stageLabel = enumToUi(canonicalStageKey);

  // show skeleton UI while loading
  const isLoading = loadingStage;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const renderMainCard = () => {
    switch (canonicalStageKey) {
      case "pregnant":
        return (
          <>
            <h3 className="text-2xl font-bold mb-2">You are now</h3>
            <h1 className="text-4xl font-extrabold leading-tight text-[#474747]">
              {effectiveWeeks !== null ? `${effectiveWeeks} weeks` : "— weeks"}
            </h1>
            <p className="text-2xl font-semibold mb-6">pregnant.</p>
            <p className="text-white/90 text-xl absolute bottom-8 font-rubik font-light">
              Your baby is as big as a{" "}
              <span className="font-bold">{fruit.name}!</span>
            </p>
          </>
        );
      case "postpartum":
        return (
          <>
            <h3 className="text-2xl font-bold mb-2">Postpartum stage</h3>
            <h1 className="text-3xl font-extrabold leading-tight text-[#474747]">
              Welcome to your recovery journey
            </h1>
            <p className="text-lg font-semibold mb-6">
              Tips and self-care for the first weeks
            </p>

            {/* replaced the static p tag with the RandomTip component */}
            <PostpartumTip className="text-white/90 text-xl absolute bottom-8 font-rubik font-light" />
          </>
        );
      case "childcare":
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
  const fruit = getFruitByWeek(effectiveWeeks);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="min-h-screen bg-pink-50 flex flex-col font-poppins">
        <Header onMenuClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        {/* Greeting */}
        <div className="flex flex-col items-center text-center mt-8 px-4">
          <h2 className="text-4xl font-bold text-bloomPink">
            Hello,{" "}
            {isLoading ? "Mama!" : userName ? `Mama ${userName}` : "Mama!"}
            {stageLabel && (
              <span className="text-lg font-medium text-[#474747] ml-3">
                — {stageLabel}
              </span>
            )}
          </h2>
          <p className="text-[#474747] font-rubik mt-2 mb-[-5px] font-light text-lg">
            “One day at a time, one heartbeat at a time — you are growing a
            miracle.”
          </p>
        </div>

        {/* Dashboard Layout */}

        <div className="grid grid-cols-1 md:grid-cols-[550px_1fr] gap-6 p-8 max-w-6xl mx-auto w-full">
          {/* Left Info Card */}
          <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-8 rounded-[20px] shadow-lg relative">
            {renderMainCard()}

            <div className="absolute bottom-6 right-6 h-40 w-40 bg-white/80 rounded-full border-8 border-white flex items-center justify-center overflow-hidden">
              {fruit && (
                <img
                  src={fruit.image}
                  alt={fruit.name}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </div>

          {/* Right Column */}
          <div className="flex flex-col gap-6">
            {/* Progress */}
            <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] text-pink-800 p-6 rounded-[20px] shadow-md font-semibold">
              <h3 className="text-2xl mb-2 text-white font-bold">Progress</h3>
              <div className="w-full bg-white/60 rounded-full h-5 mt-3 overflow-hidden">
                <div
                  className={`bg-[#DE085F] h-full ${
                    isLoading ? "w-0" : "w-1/3"
                  } rounded-full`}
                ></div>
              </div>
              <p className="mt-2 text-lg text-center text-[#DE085F] font-bold">
                17% complete
              </p>
              <p className="mt-2 text-lg text-[#474747] font-rubik font-light">
                <span className="font-bold">Remaining:</span> 83% (33 weeks, 2
                days)
              </p>
              <p className="mt-2 text-lg text-[#474747] font-rubik font-light">
                <span className="font-bold">Due Date:</span> January 15, 2024
              </p>
            </div>

            {/* To-do + Tips side by side */}
            <div className="grid grid-cols-2 gap-4">
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

              <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] text-pink-800 p-6 rounded-[20px] shadow-md">
                <h3 className="text-2xl mb-3 text-white font-bold">Tips</h3>
                <p className="text-sm text-[#474747] font-rubik">
                  Drink plenty of water 💧 and take short naps when you feel
                  tired.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
