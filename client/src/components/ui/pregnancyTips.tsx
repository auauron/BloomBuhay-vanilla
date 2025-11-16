import React, { useEffect, useState } from "react";

interface PregnancyTipsProps {
  className?: string; 
  tips?: string[];
  storageKey?: string;
}

const DEFAULT_PREGNANCY_TIPS = [
  // Nutrition & Health
  "Aim for 264+ minutes of moderate exercise weekly to reduce gestational diabetes risk",
  "Consume 600-800 mcg of folic acid daily to prevent neural tube defects",
  "Eat 71g of protein daily for baby's growth and development",
  "Get 1,000mg of calcium daily for baby's bone and teeth formation",
  "Include 27mg of iron daily to support increased blood production",
  "Take 600 IU of vitamin D daily for bone health and immune function",
  "Eat small, frequent meals every 2-3 hours to manage nausea",
  "Choose bland foods like crackers, toast, and bananas when nauseous",
  "Avoid strong food odors and spicy foods that trigger morning sickness",
  "Stay hydrated with water, ginger tea, or electrolyte drinks",

  // Exercise & Activity
  "Continue pre-pregnancy exercise routines if medically approved",
  "Combine cardiovascular and resistance exercises for maximum benefit",
  "Monitor for concerning symptoms and adjust exercise intensity accordingly",
  "Walk daily - it's safe throughout pregnancy and helps circulation",
  "Practice prenatal yoga for flexibility and stress reduction",
  "Swim or do water aerobics for low-impact joint relief",

  // Symptoms & Comfort
  "Rest whenever you feel fatigued - your body is building a placenta",
  "Sleep on your left side to improve circulation to your baby",
  "Use extra pillows for support while sleeping as your belly grows",
  "Wear supportive maternity bras as breasts become tender and swollen",
  "Elevate your feet to reduce swelling in ankles and feet",
  "Practice deep breathing exercises for relaxation and oxygen flow",

  // Development & Monitoring
  "Track baby's growth - from sesame seed size at 5 weeks to larger fruits",
  "Note when you feel first movements (quickening) around 18-22 weeks",
  "Monitor for consistent fetal movement patterns in third trimester",
  "Watch for signs of preterm labor: regular contractions, pelvic pressure",
  "Keep all prenatal appointments for regular health assessments",

  // Safety & Precautions
  "Avoid alcohol, smoking, and recreational drugs completely",
  "Limit exposure to chemicals, cleaning products, and pesticides",
  "Wear seatbelt properly with lap belt under your belly",
  "Avoid hot tubs and saunas that can raise body temperature too high",
  "Practice good hand hygiene to prevent infections",

  // Mental Health & Preparation
  "Practice stress management techniques like meditation",
  "Connect with other expectant parents for support",
  "Start prenatal education classes in second trimester",
  "Create a birth plan and discuss preferences with your provider",
  "Prepare older siblings for the new baby's arrival",
  "Pack your hospital bag by 36 weeks",

  // Second Trimester Specific
  "Enjoy increased energy levels typically experienced in second trimester",
  "Notice skin changes like linea nigra - they're normal and temporary",
  "Feel your uterus growing upward as baby bump becomes more visible",
  "Experience round ligament pain as uterus expands - it's normal",
  "Deal with nasal congestion and occasional nosebleeds from increased blood flow"
];

export default function PregnancyTips({
  className = "text-white/90 text-xl absolute bottom-8 font-rubik font-light",
  tips = DEFAULT_PREGNANCY_TIPS,
  storageKey = "pregnancyTipIndex"
}: PregnancyTipsProps) {
  const [tip, setTip] = useState<string>("");

  useEffect(() => {
    if (!tips || tips.length === 0) {
      setTip("");
      return;
    }

    const lastStr = sessionStorage.getItem(storageKey);
    const lastIndex = lastStr ? Number(lastStr) : -1;

    let idx = Math.floor(Math.random() * tips.length);
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