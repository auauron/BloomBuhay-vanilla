import React, { useEffect, useState } from "react";

interface PostpartumTipsProps {
  className?: string; 
  tips?: string[];
  storageKey?: string;
}

const DEFAULT_POSTPARTUM_TIPS = [
  // Breastfeeding & Nutrition (WHO, Mayo Clinic, Cleveland Clinic)
  "Breastfeed within the first hour after birth for optimal bonding and immunity",
  "Practice exclusive breastfeeding for the first 6 months as recommended by WHO",
  "Eat an extra 300-500 calories daily if exclusively breastfeeding",
  "Stay well-hydrated - drink water whenever you sit down to breastfeed",
  "Watch for proper latch: baby's mouth wide open, lips flanged out, no nipple pain",
  "Breastfeed 8-12 times per day in the early weeks to establish milk supply",
  "Look for feeding cues: rooting, hand-to-mouth movements, smacking lips",
  "Count wet diapers - 6+ per day after day 5 indicates adequate feeding",
  "Seek lactation support if experiencing pain, poor latch, or supply concerns",
  "Pump and store breast milk if returning to work or needing flexibility",

  // Physical Recovery & Exercise (Mayo Clinic, Stanford Children's)
  "Wait for healthcare provider clearance before starting exercise (typically 4-6 weeks)",
  "Begin with gentle walking and gradually increase duration and intensity",
  "Practice pelvic floor exercises (Kegels) to strengthen core muscles",
  "Start with 5-10 minute exercise sessions and slowly build up",
  "Stop any activity that causes pain, bleeding, or discomfort",
  "Wear supportive clothing, especially sports bras for breastfeeding moms",
  "Focus on posture and body mechanics when lifting your baby",
  "Be aware of diastasis recti (abdominal separation) and do safe exercises",
  "Listen to your body - some days you'll have more energy than others",
  "Combine strength training with cardiovascular exercise for best results",

  // Emotional & Mental Health (Mayo Clinic, ECommunity)
  "Watch for baby blues (temporary mood swings) vs postpartum depression",
  "Seek help if experiencing overwhelming sadness, anxiety, or mood changes",
  "Share your feelings with your partner, friends, or healthcare provider",
  "Join postpartum support groups to connect with other new parents",
  "Practice self-compassion - adjustment to parenting takes time",
  "Take breaks when needed - even 15 minutes alone can refresh your perspective",
  "Limit visitors and social obligations if you're feeling overwhelmed",
  "Acknowledge that it's normal to have mixed emotions about parenting",
  "Get professional help immediately if having thoughts of harming yourself or baby",
  "Remember that postpartum mental health conditions are treatable with support",

  // Self-Care & Daily Management (Stanford, ECommunity)
  "Sleep when your baby sleeps to combat fatigue and sleep deprivation",
  "Accept help from family and friends with meals, chores, or baby care",
  "Shower daily - it can boost your mood and make you feel more human",
  "Eat regular, nutritious meals even if they're simple and quick",
  "Stay hydrated - keep water bottles handy throughout your home",
  "Get outside for fresh air and sunlight daily, even for short periods",
  "Wear comfortable clothes that make you feel good about yourself",
  "Keep healthy snacks easily accessible for quick energy boosts",
  "Take micro-breaks - 5 minutes of deep breathing or stretching helps",
  "Practice saying 'no' to unnecessary commitments and visitors",

  // Physical Care & Warning Signs (Cleveland Clinic, Stanford)
  "Care for your perineal area with proper hygiene and sitz baths",
  "Use prescribed pain medications as directed for recovery discomfort",
  "Watch for signs of infection: fever, redness, swelling, or foul discharge",
  "Monitor bleeding - it should gradually decrease and change color",
  "Eat high-fiber foods and stay hydrated to prevent constipation",
  "Use stool softeners if needed, especially after cesarean delivery",
  "Practice good breast hygiene to prevent mastitis and clogged ducts",
  "Watch for mastitis signs: fever, breast pain, redness, flu-like symptoms",
  "Contact your provider if experiencing severe pain or heavy bleeding",
  "Attend all scheduled postpartum checkups for proper recovery monitoring",

  // Support Systems & Relationships (ECommunity, Stanford)
  "Communicate your needs clearly to your partner and support people",
  "Create a list of specific tasks others can help with when they offer",
  "Schedule regular check-ins with your partner about shared responsibilities",
  "Identify trusted people who can provide practical help and emotional support",
  "Connect with other new parents who understand what you're experiencing",
  "Consider professional help like postpartum doulas or cleaning services",
  "Build a childcare backup plan for when you need extended breaks",
  "Maintain intimacy with your partner through communication and small gestures",
  "Remember that asking for help is a sign of strength, not weakness",
  "Celebrate small parenting victories and daily accomplishments",

  // Realistic Expectations & Mental Shifts
  "Understand that 'perfect parenting' doesn't exist - aim for 'good enough'",
  "Be patient with yourself - learning to parent takes time and practice",
  "Focus on bonding with your baby rather than comparing to others",
  "Trust your instincts - you know your baby better than any book or app",
  "Take photos and notes - these early days pass quickly despite feeling long",
  "Embrace the messy moments - they're part of the authentic parenting journey",
  "Remember that self-care makes you a better caregiver for your baby",
  "Balance baby's needs with your own - both are important for family health",
  "Celebrate making it through each day - you're doing better than you think",
  "Know that the intense newborn phase is temporary and will evolve"
];

export default function PostpartumTips({
  className = "text-white/90 text-xl absolute bottom-8 font-rubik font-light",
  tips = DEFAULT_POSTPARTUM_TIPS,
  storageKey = "postpartumTipIndex"
}: PostpartumTipsProps) {
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