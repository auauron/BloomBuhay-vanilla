import React, { useEffect, useState } from "react";

interface PregnancyTipsProps {
  className?: string; 
  tips?: string[];
  storageKey?: string;
}

const DEFAULT_PREGNANCY_TIPS = [
  // === NEW SYMPTOM MANAGEMENT TIPS ===
  "Track your symptoms daily to identify patterns and triggers",
  "Morning sickness can occur any time - keep crackers by your bed",
  "Stay hydrated with small sips throughout the day if nauseous",
  "Wear comfortable, non-restrictive clothing as your body changes",
  "Use pregnancy pillows for better sleep and back support",
  "Practice good posture to alleviate back pain as belly grows",
  
  // === EARLY PREGNANCY SIGNS ===
  "Take a pregnancy test with first-morning urine for most accurate results",
  "Track your menstrual cycle to recognize early missed periods",
  "Note any breast tenderness or changes - common early sign",
  "Watch for implantation spotting - light pink or brown discharge",
  "Monitor basal body temperature - sustained elevation may indicate pregnancy",
  "Recognize food aversions - sudden dislike of certain smells or foods",
  
  // === TRIMESTER-SPECIFIC SYMPTOMS ===
  "First trimester: Rest often - fatigue is normal as body works hard",
  "Second trimester: Enjoy renewed energy - perfect time for gentle exercise",
  "Third trimester: Sleep propped up to ease shortness of breath",
  "Use nasal saline spray for pregnancy-related congestion",
  "Elevate feet to reduce swelling in later pregnancy",
  "Wear compression stockings if experiencing varicose veins",
  
  // === SYMPTOM RELIEF STRATEGIES ===
  "For heartburn: Eat smaller meals and avoid lying down after eating",
  "For constipation: Increase fiber and water intake, walk regularly",
  "For round ligament pain: Change positions slowly, avoid sudden movements",
  "For leg cramps: Stretch calves before bed, stay hydrated",
  "For back pain: Practice pelvic tilts, wear supportive shoes",
  "For swelling: Limit salt, elevate legs, stay cool",
  
  // === PREGNANCY CONFIRMATION & NEXT STEPS ===
  "Confirm home test results with healthcare provider",
  "Schedule first prenatal appointment around 8 weeks",
  "Start prenatal vitamins before confirmation if trying to conceive",
  "Calculate your due date from first day of last menstrual period",
  "Research and choose your healthcare provider early",
  "Build your support team - partner, family, friends, doula",
  
  // === MENTAL & EMOTIONAL HEALTH ===
  "Share your feelings - pregnancy brings many emotional changes",
  "Join pregnancy support groups for community connection",
  "Practice mindfulness to manage anxiety about pregnancy changes",
  "Keep a pregnancy journal to document your journey",
  "Celebrate each milestone - positive test, first ultrasound, feeling movements",
  "Be patient with mood swings - hormonal changes affect emotions",
  
  // === BODY CHANGES & COMFORT ===
  "Moisturize belly daily to help with itching and skin stretching",
  "Wear supportive footwear as center of gravity shifts",
  "Use pregnancy belts for extra abdominal support if needed",
  "Sleep on your side, especially left side, for optimal blood flow",
  "Take warm (not hot) baths for muscle relaxation",
  "Practice Kegel exercises to strengthen pelvic floor muscles",
  
  // === WARNING SIGNS TO WATCH FOR ===
  "Contact provider for severe abdominal pain or cramping",
  "Seek immediate care for heavy bleeding or fluid leakage",
  "Report severe headaches or vision changes promptly",
  "Monitor for signs of preterm labor before 37 weeks",
  "Watch for decreased fetal movement in third trimester",
  "Note any fever over 100.4°F or signs of infection",
  
  // === NUTRITION & HYDRATION ===
  "Eat iron-rich foods: lean red meat, spinach, lentils, fortified cereals",
  "Include omega-3s: salmon, walnuts, chia seeds for baby's brain development",
  "Choose complex carbs: whole grains, vegetables for sustained energy",
  "Snack on protein-rich foods between meals to stabilize blood sugar",
  "Limit empty calories - focus on nutrient-dense foods",
  "Carry healthy snacks to prevent low blood sugar and nausea",
  "Folic acid is critical for neural tube development in first trimester",
  "Omega-3 DHA is essential for baby's brain and eye development",
  "Calcium builds strong bones and teeth - aim for 1,000mg daily",
  "Iron supports placenta development and prevents anemia - 27mg daily",
  "Choline supports brain development and prevents neural tube defects",
  "Eat additional 300-500 calories in second and third trimesters",
  "Choose complex carbs like whole grains for sustained energy",
  "Wash all fruits and vegetables thoroughly to prevent foodborne illness",
  "Limit high-mercury fish like shark and swordfish",
  "Reheat leftovers until steaming hot to ensure food safety",
  "Manage heartburn by eating smaller portions and avoiding spicy foods",
  "Use nutrition to combat fatigue - choose protein and complex carbs",
  
  // === PREPARATION & PLANNING ===
  "Create a birth plan but stay flexible for unexpected changes",
  "Tour hospital or birth center in third trimester",
  "Pack hospital bag by 35 weeks including comfort items",
  "Install car seat at least 3 weeks before due date",
  "Freeze meals for postpartum recovery period",
  "Set up baby's sleeping area and essentials in advance",
  
  // === GENERAL WELLNESS ===
  "Stay active with doctor-approved exercises throughout pregnancy",
  "Get fresh air and sunlight daily for vitamin D and mood boost",
  "Practice good dental hygiene - pregnancy can affect gum health",
  "Stay cool in warm weather - pregnancy increases body temperature",
  "Listen to your body - rest when tired, eat when hungry",
  "Trust your instincts - you know your body best",
  "Strengthen uterine muscles through exercise for more efficient contractions",
  "Improve cardiovascular endurance to handle labor's physical demands",
  "Enhance hip and pelvis flexibility for better birthing positions",
  "Practice Kegel exercises daily to improve pelvic floor control",
  "Focus on consistency in exercise rather than intensity during pregnancy",
  "Stop exercise if you experience vaginal bleeding or decreased fetal movement",
  "Modify balance exercises as your center of gravity shifts in second trimester",
  "Avoid contact sports and activities with falling risk throughout pregnancy",
  "Use swimming for low-impact full-body conditioning that's joint-friendly",
  "Monitor your heart rate - you should be able to talk during exercise",

  // === EXISTING TIPS ===
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
  "Continue pre-pregnancy exercise routines if medically approved",
  "Combine cardiovascular and resistance exercises for maximum benefit",
  "Monitor for concerning symptoms and adjust exercise intensity accordingly",
  "Walk daily - it's safe throughout pregnancy and helps circulation",
  "Practice prenatal yoga for flexibility and stress reduction",
  "Swim or do water aerobics for low-impact joint relief",
  "Rest whenever you feel fatigued - your body is building a placenta",
  "Sleep on your left side to improve circulation to your baby",
  "Use extra pillows for support while sleeping as your belly grows",
  "Wear supportive maternity bras as breasts become tender and swollen",
  "Elevate your feet to reduce swelling in ankles and feet",
  "Practice deep breathing exercises for relaxation and oxygen flow",
  "Track baby's growth - from sesame seed size at 5 weeks to larger fruits",
  "Note when you feel first movements (quickening) around 18-22 weeks",
  "Monitor for consistent fetal movement patterns in third trimester",
  "Watch for signs of preterm labor: regular contractions, pelvic pressure",
  "Keep all prenatal appointments for regular health assessments",
  "Avoid alcohol, smoking, and recreational drugs completely",
  "Limit exposure to chemicals, cleaning products, and pesticides",
  "Wear seatbelt properly with lap belt under your belly",
  "Avoid hot tubs and saunas that can raise body temperature too high",
  "Practice good hand hygiene to prevent infections",
  "Practice stress management techniques like meditation",
  "Connect with other expectant parents for support",
  "Start prenatal education classes in second trimester",
  "Create a birth plan and discuss preferences with your provider",
  "Prepare older siblings for the new baby's arrival",
  "Pack your hospital bag by 36 weeks",
  "Enjoy increased energy levels typically experienced in second trimester",
  "Notice skin changes like linea nigra - they're normal and temporary",
  "Feel your uterus growing upward as baby bump becomes more visible",
  "Experience round ligament pain as uterus expands - it's normal",
  "Deal with nasal congestion and occasional nosebleeds from increased blood flow",
  "Exercise reduces back pain and improves posture during pregnancy",
  "Physical activity helps prevent gestational diabetes and hypertension",
  "Regular exercise boosts mood and reduces pregnancy-related anxiety",
  "Aim for 150 minutes of moderate activity weekly during pregnancy",
  "Iron prevents anemia and supports increased blood volume",
  "Calcium maintains your bone density as baby draws from reserves",
  "Eat diverse diet including all food groups daily",
  "Global nutrition guidelines emphasize variety and balance",
  "Adjust nutritional focus as pregnancy progresses through trimesters",
  "Proper maternal nutrition supports both mother and baby's health",
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