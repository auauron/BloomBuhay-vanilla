import React, { useState } from "react";
import "../../index.css";

interface Mood {
  day: string;
  mood: string;
  notes: string;
}

const moodIcons = ["😊", "😄", "😍", "😴", "🤢", "😔", "😠", "😰", "😭", "😐"];

const MoodTracker: React.FC = () => {
  const [moodData, setMoodData] = useState<Mood[]>([
    { day: "Mon", mood: "😊", notes: "Feeling good" },
    { day: "Tue", mood: "😴", notes: "Very tired" },
    { day: "Wed", mood: "🤢", notes: "Morning sickness" },
    { day: "Thu", mood: "😄", notes: "Happy day!" },
    { day: "Fri", mood: "😔", notes: "Back pain" },
    { day: "Sat", mood: "😊", notes: "Relaxing" },
    { day: "Sun", mood: "😍", notes: "Baby kicked!" },
  ]);

  const logMood = (mood: string) => {
    const today = new Date().toLocaleDateString("en-US", { weekday: "short" });
    const newMood: Mood = { day: today, mood, notes: "How are you feeling?" };
    setMoodData([...moodData.slice(1), newMood]);
  };

  return (
    <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-6 rounded-2xl shadow-lg">
      <h3 className="text-2xl font-bold mb-4">Mood Tracker</h3>
      <p className="text-white/80 mb-4">How are you feeling today?</p>
      <div className="grid grid-cols-5 gap-3 mb-6">
        {moodIcons.map((mood, idx) => (
          <button
            key={idx}
            onClick={() => logMood(mood)}
            className="text-2xl p-3 bg-white/20 rounded-lg hover:bg-white/30 transition"
          >
            {mood}
          </button>
        ))}
      </div>
      <div className="bg-white/20 rounded-lg p-4">
        <h4 className="font-semibold mb-3">This Week's Mood</h4>
        <div className="flex justify-between items-end gap-4">
          {moodData.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <span className="text-2xl mb-2">{day.mood}</span>
              <span className="text-xs text-white/80">{day.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MoodTracker;
