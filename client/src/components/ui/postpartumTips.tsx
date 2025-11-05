import React, { useEffect, useState } from "react";

interface PostpartumTIpsProps {
  className?: string; // optional className to match your layout
  tips?: string[]; // optional override of the tips list
  storageKey?: string; // optional sessionStorage key
}

const DEFAULT_TIPS = [
  "Rest whenever possible - sleep when your baby sleeps",
  "Manage pain with prescribed medications and warm baths",
  "Eat nutritious meals and stay hydrated",
  "Care for your perineal area with proper hygiene",
  "Accept help from family and friends",
  "Share your feelings with your partner or support person",
  "Be patient with yourself - adjustment takes time",
  "Watch for baby blues (common) vs postpartum depression (requires treatment)",
  "Take breaks when needed - even 15 minutes alone can help",
  "Watch for signs of infection and contact your provider if concerned",
  "Shower daily - it can boost your mood and energy",
  "Wear comfortable clothes that make you feel good",
  "Spend time outdoors when possible",
  "Connect with other new parents for support",
  "Keep water and healthy snacks nearby for easy access",
  "Ask for help with household tasks and baby care",
  "Connect with friends who understand your experience",
  "Practice saying 'no' to unnecessary commitments",
  "Keep a list of quick self-care activities for busy days"
];

export default function RandomTip({
  className = "text-white/90 text-xl absolute bottom-8 font-rubik font-light",
  tips = DEFAULT_TIPS,
  storageKey = "randomTipIndex"
}: PostpartumTIpsProps) {
  const [tip, setTip] = useState<string>("");

  useEffect(() => {
    if (!tips || tips.length === 0) {
      setTip("");
      return;
    }

    // Try avoid repeating the same tip on refresh by checking sessionStorage
    const lastStr = sessionStorage.getItem(storageKey);
    const lastIndex = lastStr ? Number(lastStr) : -1;

    let idx = Math.floor(Math.random() * tips.length);
    // up to a few attempts to get a different tip
    let attempts = 0;
    while (tips.length > 1 && idx === lastIndex && attempts < 5) {
      idx = Math.floor(Math.random() * tips.length);
      attempts++;
    }

    sessionStorage.setItem(storageKey, String(idx));
    setTip(tips[idx]);
  }, [tips, storageKey]);

  if (!tip) return null;

  return <p className={className}>{tip}</p>;
}
