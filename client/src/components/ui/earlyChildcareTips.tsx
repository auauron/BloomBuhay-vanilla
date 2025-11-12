import React, { useEffect, useState } from "react";

interface EarlyChildcareTipsProps {
  className?: string; 
  tips?: string[];
  storageKey?: string;
}

const DEFAULT_CHILDCARE_TIPS = [
  // Newborn Care Essentials
  "Practice immediate skin-to-skin contact after birth for bonding and warmth",
  "Begin exclusive breastfeeding within the first hour after birth",
  "Keep baby warm with proper clothing and room temperature control",
  "Practice hygienic cord care until the stump falls off naturally",
  "Recognize danger signs early: breathing problems, fever, lethargy",
  "Attend all postnatal care visits - they improve care practices 5.5x",
  "Seek counseling during pregnancy and delivery - improves care 4.4x",
  "Complete regular antenatal care - increases proper care utilization 7x",
  // Feeding & Nutrition
  "Avoid overfeeding - 93% of newborns are overfed on their first day",
  "Start with 15-20ml per feeding for average weight newborns",
  "Never give more than 30ml in single feeding sessions initially",
  "Feed every 2-3 hours or 8-12 times in 24 hours",
  "Watch for hunger cues: smacking lips, rooting, hand-to-mouth movements",
  "Recognize fullness signals: slowing sucking, turning away, relaxed hands",
  "Use smaller bottles (2oz/60ml) for first weeks to control portions",
  "Pace bottle feeding with frequent breaks for burping",
  "Avoid using feeding as the only comfort method",

  // Sleep & Routines
  "Understand normal infant sleep patterns - they vary widely",
  "Recalibrate expectations about infant sleep development",
  "Experiment with different sleep approaches to find what works",
  "Manage anxiety about sleep disruption using coping strategies",
  "Balance meeting infant needs with parental self-care",
  "Work with baby's natural sleep regulators rather than against them",
  "Create consistent bedtime routines from early weeks",
  "Practice safe sleep: alone, on back, in crib with firm mattress",

  // Development & Milestones
  "Age 2: Kicks ball, walks stairs, plays alongside others, 2-4 word sentences",
  "Age 3: Climbs and runs, pedals tricycle, takes turns, expresses emotions",
  "Age 4: Catches balls, uses scissors, prefers social play, knows songs",
  "Age 5: Hops and swings, uses utensils, speaks clearly, counts to 10",
  "Provide physical play opportunities for motor skill development",
  "Encourage social interactions through playdates and groups",
  "Read together daily to build language and cognitive skills",
  "Offer age-appropriate puzzles and games for thinking skills",
  "Create consistent routines for security and predictability",

  // Health & Safety
  "Monitor for common birth injuries: most resolve without treatment",
  "Watch for caput succedaneum (scalp swelling) - resolves in days",
  "Check for cephalohematoma (skull bleeding) - stays within bone boundaries",
  "Be aware of subgaleal hemorrhage - requires medical monitoring",
  "Watch for infection signs: redness, swelling, fever, pus drainage",
  "Seek help for neurological changes: lethargy, seizures, abnormal movements",
  "Get immediate care for respiratory distress or breathing difficulties",
  "Address feeding problems: inability to suck or swallow effectively",

  // Parental Support
  "64-67% of women experience postpartum fatigue for up to 2 years",
  "Sleep disruption is linked to increased depression and anxiety in parents",
  "Traditional sleep training often conflicts with responsive parenting",
  "Find support that aligns with your values and infant's needs",
  "Trust your instincts - you know your baby best",
  "Take micro-breaks - even 5 minutes of deep breathing helps",
  "Connect with other parents who understand your experience",
  "Remember it's okay to not be perfect - good enough is great!",

  // Cognitive & Emotional Development
  "Support physical development: gross and fine motor skills, coordination",
  "Nurture personal/social development: emotional regulation, self-care skills",
  "Encourage language development: communication, vocabulary, understanding",
  "Stimulate cognitive development: thinking, reasoning, problem-solving",
  "Praise effort and progress rather than just achievement",
  "Provide security through predictable routines and responses",
  "Model emotional regulation through your own calm responses",
  "Celebrate small milestones and daily progress"
];

export default function EarlyChildcareTips({
  className = "text-white/90 text-xl absolute bottom-8 font-rubik font-light",
  tips = DEFAULT_CHILDCARE_TIPS,
  storageKey = "childcareTipIndex"
}: EarlyChildcareTipsProps) {
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