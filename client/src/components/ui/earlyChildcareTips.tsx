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
  "Initiate breastfeeding within the first hour after birth for optimal bonding",
  "Practice exclusive breastfeeding for the first 6 months as recommended by WHO",
  "Continue breastfeeding for 2 years or longer alongside complementary foods",
  "Introduce safe complementary foods at 6 months with proper textures",
  "Practice responsive feeding by watching for hunger and fullness cues",
  "Reduce infant mortality by up to 13% through exclusive breastfeeding",
  "Support optimal brain development with proper infant nutrition",
  "Provide iron-rich foods to prevent anemia and support brain development",
  "Include zinc-rich foods for immune function and growth support",
  "Offer healthy fats crucial for brain development and energy needs",
  "Create pleasant, distraction-free eating environments for children",
  "Introduce new foods multiple times - acceptance takes repetition",
  "Avoid using food as reward or punishment with young children",
  "Serve age-appropriate portion sizes and food textures in childcare",
  "Offer variety of fruits, vegetables, and whole grains daily",
  "Limit added sugars, salt, and unhealthy fats in children's meals",
  "Provide access to clean drinking water throughout the day",
  "Train childcare staff in responsive feeding techniques and food safety",
  "Create pleasant, family-style dining atmospheres in group settings",
  "Accommodate special dietary needs and food allergies properly",

  // Sleep & Routines
  "Understand normal infant sleep patterns - they vary widely",
  "Recalibrate expectations about infant sleep development",
  "Experiment with different sleep approaches to find what works",
  "Manage anxiety about sleep disruption using coping strategies",
  "Balance meeting infant needs with parental self-care",
  "Work with baby's natural sleep regulators rather than against them",
  "Create consistent bedtime routines from early weeks",
  "Practice safe sleep: alone, on back, in crib with firm mattress",
  "Ensure newborns get 14-17 hours of sleep including naps daily",
  "Provide infants 12-15 hours of sleep including naps for optimal development",
  "Offer toddlers 11-14 hours of sleep including naps for proper rest",
  "Give preschoolers 10-13 hours of sleep including naps for growth",
  "Maintain consistent bedtimes - as important as total sleep duration",
  "Support brain development - neural connections strengthen during sleep",
  "Aid memory consolidation - learning gets processed during sleep",
  "Promote physical growth - growth hormone releases during deep sleep",
  "Strengthen immune function - sleep supports immune system development",
  "Enhance emotional regulation - well-rested children manage emotions better",
  "Improve attention and learning - adequate sleep boosts focus",
  "Create consistent pre-sleep rituals like stories or quiet music",
  "Establish comfortable, safe sleeping arrangements for each child",
  "Individualize sleep approaches based on children's needs and ages",
  "Create quiet, calm transitions from active play to rest time",
  "Observe and learn each child's unique sleep cues and patterns",
  "Use visual schedules to help children understand sleep routines",
  "Designate quiet, dimly lit sleep areas separate from play spaces",
  "Ensure proper ventilation and comfortable room temperature for sleep",
  "Implement safe sleep practices following current guidelines",
  "Build consistent bedtime routines to signal sleep time to brain",
  "Maintain regular sleep-wake schedules for biological rhythms",
  "Create calm, screen-free wind-down periods before bedtime",
  "Use comforting bedtime rituals like bath, story, or cuddles",
  "Provide appropriate sleep environments - dark, quiet, comfortable",
  "Use transitional objects to help with separation anxiety at bedtime",
  "Respond consistently to night wakings while encouraging self-soothing",
  "Establish clear bedtime limits with empathy and consistency",
  "Adjust nap schedules gradually as sleep needs change with age",
  "Maintain routines during developmental sleep regressions",
  "Share sleep information between home and childcare for consistency",

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