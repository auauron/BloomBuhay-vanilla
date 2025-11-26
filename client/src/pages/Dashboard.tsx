import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import "../index.css";
import Header from "../components/ui/Header";
import Sidebar from "../components/ui/Sidebar";
import { authService } from "../services/authService";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import messages from "../components/motivations/messages.json";
import DashboardToDoList from "../components/dashboard/DashboardToDoList";
import DashboardTipsSection from "../components/dashboard/DashboardTipsSection";

const API_BASE = (window as any).__API_URL__ || "http://localhost:3000";

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const stateAny = (location.state as any) ?? {};
  const stageFromState =
    (stateAny.stage as string | undefined) ??
    (stateAny.motherhoodStage as string | undefined) ??
    null;

  const searchParams = new URLSearchParams(location.search);
  const stageFromQuery = searchParams.get("stage");

  const [stageFromDb, setStageFromDb] = useState<string | null>(null);
  const [loadingStage, setLoadingStage] = useState(true);

  const [userName, setUserName] = useState<string | null>(null);
  const [weeksPregnant, setWeeksPregnant] = useState<number | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState("");

  const babySizeFruits: { maxWeek: number; name: string; image: string }[] = [
    {
      maxWeek: 4,
      name: "Poppy Seed",
      image: "assets/dashboardFruit/Poppy_seed.png",
    },
    {
      maxWeek: 5,
      name: "Sesame Seed",
      image: "assets/dashboardFruit/Sesame.png",
    },
    {
      maxWeek: 6,
      name: "Lentil Seed",
      image: "assets/dashboardFruit/Lentil.png",
    },
    {
      maxWeek: 7,
      name: "Blueberry",
      image: "assets/dashboardFruit/Blueberry.png",
    },
    {
      maxWeek: 8,
      name: "Raspberry",
      image: "assets/dashboardFruit/Poppy_seed.png",
    },
    { maxWeek: 9, name: "Grape", image: "assets/dashboardFruit/Grape.png" },
    { maxWeek: 10, name: "Date", image: "assets/dashboardFruit/Dates.png" },
    { maxWeek: 11, name: "Lime", image: "assets/dashboardFruit/Lime.png" },
    { maxWeek: 12, name: "Plum", image: "assets/dashboardFruit/Plum.png" },
    { maxWeek: 13, name: "Kiwi", image: "assets/dashboardFruit/Kiwi.png" },
    { maxWeek: 14, name: "Peach", image: "assets/dashboardFruit/Peach.png" },
    { maxWeek: 15, name: "Pear", image: "assets/dashboardFruit/Pear.png" },
    {
      maxWeek: 16,
      name: "Avocado",
      image: "assets/dashboardFruit/Avocado.png",
    },
    {
      maxWeek: 17,
      name: "Naval Orange",
      image: "assets/dashboardFruit/Naval_orange.png",
    },
    {
      maxWeek: 18,
      name: "Pomegranate",
      image: "assets/dashboardFruit/Pomegranate.png",
    },
    {
      maxWeek: 19,
      name: "Grapefruit",
      image: "assets/dashboardFruit/Grapefruit.png",
    },
    { maxWeek: 20, name: "Mango", image: "assets/dashboardFruit/Mango.png" },
    {
      maxWeek: 21,
      name: "Rockmelon",
      image: "assets/dashboardFruit/Rockmelon.png",
    },
    {
      maxWeek: 24,
      name: "Eggplant",
      image: "assets/dashboardFruit/Eggplant.png",
    },
    { maxWeek: 28, name: "Papaya", image: "assets/dashboardFruit/Papaya.png" },
    {
      maxWeek: 36,
      name: "Honeydew",
      image: "assets/dashboardFruit/Honeydew.png",
    },
    {
      maxWeek: 40,
      name: "Watermelon",
      image: "assets/dashboardFruit/Watermelon.png",
    },
  ];

  const getFruitByWeek = (week: number | null) => {
    if (week === null) return null;
    return (
      babySizeFruits.find((f) => week <= f.maxWeek) ??
      babySizeFruits[babySizeFruits.length - 1]
    );
  };

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

  const getRandomMotivationalMessage = (stage: string | null) => {
    let messagePool: string[] = [];

    if (stage && messages[stage as keyof typeof messages]) {
      messagePool = [...messages[stage as keyof typeof messages]];
    }

    messagePool = [...messagePool, ...messages.general];

    const randomIndex = Math.floor(Math.random() * messagePool.length);
    return messagePool[randomIndex];
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
            if (mounted) {
              setStageFromDb(profile.stage ?? null);
              const wp =
                profile.weeksPregnant ??
                profile.weeks_pregnant ??
                profile.weeks_pregnancy ??
                profile.weeks;
              setWeeksPregnant(typeof wp === "number" ? wp : null);

              try {
                if (profile.stage)
                  localStorage.setItem("lastStage", String(profile.stage));
                if (typeof wp === "number")
                  localStorage.setItem("lastWeeksPregnant", String(wp));
              } catch (e) {}
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

  const cachedStage = localStorage.getItem("lastStage");
  const cachedWeeks = Number(localStorage.getItem("lastWeeksPregnant") ?? NaN);
  const effectiveWeeks =
    weeksPregnant ?? (Number.isInteger(cachedWeeks) ? cachedWeeks : null);

  const canonicalStageKey =
    stageFromState ?? stageFromQuery ?? stageFromDb ?? (cachedStage || null);

  const stageLabel = enumToUi(canonicalStageKey);

  useEffect(() => {
    setMotivationalMessage(getRandomMotivationalMessage(canonicalStageKey));
  }, [canonicalStageKey]);

  const isLoading = loadingStage;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  const fruit = getFruitByWeek(effectiveWeeks);

  // Helper functions for childcare stage
  const getBabyAge = (): string => {
    if (!effectiveWeeks) return "Not set";

    const totalWeeks = effectiveWeeks;
    const years = Math.floor(totalWeeks / 52);
    const remainingWeeks = totalWeeks % 52;
    const months = Math.floor(remainingWeeks / 4);
    const weeks = remainingWeeks % 4;

    if (years > 0) {
      return `${years} year${years > 1 ? "s" : ""}${
        months > 0 ? `, ${months} month${months > 1 ? "s" : ""}` : ""
      }`;
    } else {
      return `${months} month${months > 1 ? "s" : ""}${
        weeks > 0 ? `, ${weeks} week${weeks > 1 ? "s" : ""}` : ""
      }`;
    }
  };

  const getDevelopmentStage = (): string => {
    if (!effectiveWeeks) return "Newborn";

    const months = Math.floor(effectiveWeeks / 4);

    if (months < 3) return "Newborn";
    if (months < 6) return "Infant";
    if (months < 12) return "Baby";
    if (months < 24) return "Toddler";
    return "Preschooler";
  };

  const getCurrentFocus = (): string => {
    if (!effectiveWeeks) return "Bonding & feeding";

    const months = Math.floor(effectiveWeeks / 4);

    const focuses: Record<string, string> = {
      "0": "Bonding & establishing routines",
      "3": "Tummy time & visual tracking",
      "6": "Sitting & solid foods",
      "9": "Crawling & babbling",
      "12": "Walking & first words",
      "18": "Running & simple sentences",
      "24": "Pretend play & independence",
      "36": "Social skills & potty training",
    };

    // Find the closest milestone
    const closest = Object.keys(focuses).reduce((prev, curr) =>
      Math.abs(months - parseInt(curr)) < Math.abs(months - parseInt(prev))
        ? curr
        : prev
    );

    return focuses[closest] ?? "Learning & growing every day!";
  };

  const renderMainCard = () => {
    switch (canonicalStageKey) {
      case "pregnant":
        return (
          <>
            <h3 className="text-xl md:text-2xl font-bold mb-2">You are now</h3>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight text-[#474747]">
              {effectiveWeeks !== null ? `${effectiveWeeks} weeks` : "— weeks"}
            </h1>
            <p className="text-xl md:text-2xl font-semibold mb-4 md:mb-6">
              pregnant.
            </p>
            <div className="flex justify-center my-4">
              <img
                src="assets/pregnant.png"
                alt="Pregnant"
                className="h-70 w-80 md:h-100 md:w-100 object-contain"
              />
            </div>
            <p className="text-white/90 text-lg md:text-xl font-rubik font-light mb-20 md:mb-0 md:absolute md:bottom-8">
              Your baby is as big as a{" "}
              <span className="font-bold">{fruit?.name ?? "—"}!</span>
            </p>
            <div className="absolute bottom-4 right-4 md:bottom-6 md:right-6 h-24 w-24 md:h-40 md:w-40 bg-white/80 rounded-full border-4 md:border-8 border-white flex items-center justify-center overflow-hidden">
              {fruit && (
                <img
                  src={fruit.image}
                  alt={fruit.name}
                  className="h-full w-full object-contain"
                />
              )}
            </div>
          </>
        );
      case "postpartum":
        return (
          <>
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              Postpartum stage
            </h3>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-[#474747]">
              Welcome to your recovery journey
            </h1>
            <p className="text-base md:text-lg font-semibold mb-4 md:mb-6">
              Tips and self-care for the first weeks
            </p>
            <div className="flex justify-center my-4">
              <img
                src="assets/postpartum.png"
                alt="Postpartum recovery"
                className="h-80 w-80 md:h-100 md:w-100 object-contain"
              />
            </div>

            <p className="text-white/90 text-lg md:text-xl font-rubik font-light mb-20 md:mb-0 md:absolute md:bottom-8">
              Small wins every day — celebrate every milestone.
            </p>
          </>
        );
      case "childcare":
        return (
          <>
            <h3 className="text-xl md:text-2xl font-bold mb-2">
              Early Childcare
            </h3>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-[#474747]">
              Track your baby's growth
            </h1>
            <p className="text-base md:text-lg font-semibold mb-4 md:mb-6">
              Feeding, sleep, and developmental milestones
            </p>
            <div className="flex justify-center my-4">
              <img
                src="assets/earlychildcaredashboard.png" // Update with your image path
                alt="Baby development tracking"
                className="h-100 w-100 md:h-100 md:w-100 object-contain"
              />
            </div>
            <p className="text-white/90 text-lg md:text-xl font-rubik font-light mb-20 md:mb-0 md:absolute md:bottom-8">
              Small wins every day — celebrate every milestone.
            </p>
          </>
        );
      default:
        return (
          <>
            <h3 className="text-xl md:text-2xl font-bold mb-2">Welcome</h3>
            <h1 className="text-2xl md:text-3xl font-extrabold leading-tight text-[#474747]">
              Let's get you set up
            </h1>
            <p className="text-base md:text-lg font-semibold mb-4 md:mb-6">
              Complete your setup to get personalized tips
            </p>
            <p className="text-white/90 text-lg md:text-xl font-rubik font-light mb-20 md:mb-0 md:absolute md:bottom-8">
              Choose your stage to start getting tailored content.
            </p>
          </>
        );
    }
  };

  const getProgressPercentage = (): string => {
    if (!canonicalStageKey || !effectiveWeeks) return "0%";

    switch (canonicalStageKey) {
      case "pregnant":
        const pregnancyProgress = Math.min(
          Math.round((effectiveWeeks / 40) * 100),
          100
        );
        return `${pregnancyProgress}%`;

      case "postpartum":
        const postpartumWeeks = effectiveWeeks || 0;
        const postpartumProgress = Math.min(
          Math.round((postpartumWeeks / 12) * 100),
          100
        );
        return `${postpartumProgress}%`;

      case "childcare":
        const months = Math.floor(effectiveWeeks / 4);
        if (months < 12)
          return `${Math.min(Math.round((months / 12) * 100), 100)}%`;
        return "Growing strong!";

      default:
        return "0%";
    }
  };

  const getRemainingPercentage = (): string => {
    const progress = getProgressPercentage();
    const progressNum = parseInt(progress) || 0;
    return `${100 - progressNum}%`;
  };

  const getRemainingTime = (): string => {
    if (!canonicalStageKey || !effectiveWeeks) return "Not set";

    switch (canonicalStageKey) {
      case "pregnant":
        const weeksLeft = 40 - (effectiveWeeks || 0);
        const daysLeft = weeksLeft * 7;
        return weeksLeft > 0
          ? `${weeksLeft} weeks, ${daysLeft % 7} days`
          : "Any day now!";

      case "postpartum":
        const postpartumWeeksLeft = 12 - (effectiveWeeks || 0);
        return postpartumWeeksLeft > 0
          ? `${postpartumWeeksLeft} weeks`
          : "Recovery milestone reached!";

      case "childcare":
        return "Every day brings new growth!";

      default:
        return "Complete your profile";
    }
  };

  const getDueDate = (): string => {
    if (!canonicalStageKey) return "Complete your profile";

    const today = new Date();

    switch (canonicalStageKey) {
      case "pregnant":
        if (effectiveWeeks) {
          const dueDate = new Date(today);
          dueDate.setDate(today.getDate() + (40 - effectiveWeeks) * 7);
          return dueDate.toLocaleDateString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
        return "Not set";

      case "postpartum":
        if (effectiveWeeks) {
          const recoveryEndDate = new Date(today);
          recoveryEndDate.setDate(today.getDate() + (12 - effectiveWeeks) * 7);
          return `Recovery: ${recoveryEndDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
          })}`;
        }
        return "Postpartum journey";

      case "childcare":
        return "Watching milestones unfold";

      default:
        return "Complete your profile";
    }
  };

  const getProgressWidthClass = (): string => {
    if (isLoading) return "w-0";

    const percentage = parseInt(getProgressPercentage());
    if (percentage >= 95) return "w-full";
    if (percentage >= 90) return "w-11/12";
    if (percentage >= 85) return "w-10/12";
    if (percentage >= 80) return "w-9/12";
    if (percentage >= 75) return "w-8/12";
    if (percentage >= 70) return "w-7/12";
    if (percentage >= 60) return "w-6/12";
    if (percentage >= 50) return "w-5/12";
    if (percentage >= 40) return "w-4/12";
    if (percentage >= 30) return "w-3/12";
    if (percentage >= 20) return "w-2/12";
    if (percentage >= 10) return "w-1/12";
    return "w-0";
  };

  const renderProgressSection = () => {
    if (canonicalStageKey === "childcare") {
      return (
        <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] text-pink-800 p-4 md:p-6 rounded-[20px] shadow-md font-semibold">
          <h3 className="text-xl md:text-2xl mb-2 text-white font-bold">
            Baby's Growth
          </h3>
          <p className="mt-2 text-base md:text-lg text-center rounded-[20px] bg-white/30 px-2 py-1 text-[#DE085F] font-bold">
            {isLoading ? "Loading..." : `${getBabyAge()} old`}
          </p>
          <p className="mt-2 text-base md:text-lg text-bloomBlack font-rubik font-light">
            <span className="font-bold">Development Stage:</span>{" "}
            {isLoading ? "..." : getDevelopmentStage()}
          </p>
          <p className="mt-2 text-base md:text-lg text-bloomBlack font-rubik font-light">
            <span className="font-bold">What to Expect:</span>{" "}
            {isLoading ? "..." : getCurrentFocus()}
          </p>
        </div>
      );
    }

    // Default progress section for other stages
    return (
      <div className="bg-gradient-to-r from-[#F875AA] via-[#F5ABA1] to-[#F3E198] text-pink-800 p-4 md:p-6 rounded-[20px] shadow-md font-semibold">
        <h3 className="text-xl md:text-2xl mb-2 text-white font-bold">
          Progress
        </h3>
        <div className="w-full bg-white/60 rounded-full h-4 md:h-5 mt-2 md:mt-3 overflow-hidden">
          <div
            className={`bg-[#DE085F] h-full rounded-full transition-all duration-500 ${getProgressWidthClass()}`}
          ></div>
        </div>
        <p className="mt-2 text-base md:text-lg text-center text-[#DE085F] font-bold">
          {isLoading ? "Loading..." : `${getProgressPercentage()} complete`}
        </p>
        <p className="mt-2 text-base md:text-lg text-bloomBlack font-rubik font-light">
          <span className="font-bold">Remaining:</span>{" "}
          {isLoading
            ? "..."
            : `${getRemainingPercentage()} (${getRemainingTime()})`}
        </p>
        <p className="mt-2 text-base md:text-lg text-bloomBlack font-rubik font-light">
          <span className="font-bold">Due Date:</span>{" "}
          {isLoading ? "..." : getDueDate()}
        </p>
      </div>
    );
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="h-screen bg-bloomWhite flex flex-col font-poppins relative">
        <Header onMenuClick={toggleSidebar} />
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

        <main className="flex-1 overflow-auto">
          <div className="flex flex-col items-center text-center mt-8 px-3">
            <h2 className="text-4xl font-bold text-bloomPink">
              Hello,{" "}
              {isLoading
                ? "Mama!"
                : userName
                ? `Mama ${userName.charAt(0).toUpperCase() + userName.slice(1)}!`
                : "Mama!"}
            </h2>

            {stageLabel && (
              <div className="mt-2 md:mt-3">
                <span className="text-lg md:text-xl font-rubik font-normal text-bloomBlack">
                  Bloom stage: {" "}
                  <span className="text-bloomPink"> {stageLabel} </span>
                </span>
              </div>
            )}

            <p className="text-bloomBlack text-center font-rubik mt-3 md:mt-4 mb-[-5px] font-light text-base md:text-lg max-w-2xl">
              "{motivationalMessage}"
            </p>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-[minmax(400px,550px)_1fr] gap-4 md:gap-6 p-4 md:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-6 md:p-8 rounded-[20px] shadow-lg relative min-h-[300px] md:min-h-[350px]">
              {renderMainCard()}
            </div>

            <div className="flex flex-col gap-4 md:gap-6">
              {renderProgressSection()}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <DashboardToDoList />
                <DashboardTipsSection canonicalStageKey={canonicalStageKey} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </motion.div>
  );
}
