import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, number } from "framer-motion";
import { X, ChevronRight, ChevronUp, ChevronDown, Target } from "lucide-react";
import { plannerService } from "../../../services/plannerService";
import { Task, BloomDate, BloomTime } from "../../../types/plan";

interface AddTaskModalProps {
  onClose: () => void;
  onTaskAdded?: () => Promise<void>;
}
import { getFullDate, getNow, getTime, taskID, translateBloomdate } from "../PlannerFuntions";

export default function AddTaskModal({ onClose, onTaskAdded }: AddTaskModalProps) {

  const now: BloomDate = getNow()
  const nowTime: BloomTime = getTime()
  const today: string = getFullDate(getNow())
  
  const [form, setForm] = useState<Task>({
    id: taskID( now, nowTime),
    task: "Task",
    description: null,
    isCompleted: false,
    startDate: now
  });

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [editing, setIsEditing] = useState(false)
  const [isSingleDate, setSingleDate] = useState(true);
  const [isWholeDay, setWholeDay] = useState(true);
  const [dateStart, setDateStart] = useState(today)
  const [dateEnd, setDateEnd] = useState(today)
  const [weekly, setWeekly] = useState<string[]>([])
  const [interval, setInterval] = useState(0)
  const [timeHr, setTimeHr] = useState(6)
  const [timeMin, setTimeMin] = useState(0)
  const [clock, setClock] = useState("AM")

  const [isSelectingDate, setIsSelectingDate] = useState(false)
  const [selectedDay, setSelectedDay] = useState(now)

  const handleSingleDay = () => {
    setSingleDate(!isSingleDate)
  }

  const handleWholeDay = () => {
    setWholeDay(!isWholeDay)
  }

  const handleClose = () => {
    onClose();
  }

  // const handleCancel = () => {
  //   onCancel();
  // }

  const handleAdd = async () => {
    try {
      // Convert the date from dd/mm/yyyy to yyyy-mm-dd format for the server
      const [day, month, year] = dateStart.split('/').map(Number);
      const isoDate = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      
      const response = await plannerService.createTask({
        title: title || 'New Task',
        description: description || '',
        date: isoDate
      });
      
      if (response.success) {
        if (onTaskAdded) {
          await onTaskAdded();
        }
        onClose();
      } else {
        console.error('Failed to add task:', response.error);
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  }

  const handelStartDate = () => {
    
  }

  const handleTimeMin = (val: number) => {
  }

  const handleChangeClock = () => {
    (clock === "AM")
    ? setClock("PM")
    : setClock("AM")
  }

  return (
    <AnimatePresence>
      <motion.div
        key="add-task-card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <div className="bg-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
          {/* Decorative elements */}
          {/* Header */}
          <div className="relative z-10">
            <h3 className="text-3xl font-semibold text-bloomPink mb-2 text-center">
              Add New Task
            </h3>
            <p className="text-sm text-bloomPink/80 text-center mb-6">Take it one step at a time, mama! 💕</p>

            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleClose}
              className="absolute top-0 right-0 p-2 text-bloomPink hover:text-bloomBlack transition-colors"
              aria-label="Close"
            >
              <X className="w-6 h-6" />
            </motion.button>
          </div>

          <div className="flex flex-col items-center content-center justify-between bg-white rounded-xl p-3 text-bloomBlack h-[450px] overflow-y-auto">
            <div className="w-full">
              <div className="space-y-4 relative z-10 mb-4">
                {/* Task Title */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-bloomBlack/80">Task Name</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/80 border border-bloomPink/20 text-bloomBlack placeholder-bloomPink/40 focus:outline-none focus:ring-2 focus:ring-bloomPink/30 focus:border-transparent transition-all duration-200 shadow-sm text-sm"
                      placeholder="What do you need to do?"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                      <svg className="h-5 w-5 text-bloomPink/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Task Description */}
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-bloomBlack/80">Notes (Optional)</label>
                  <div className="relative">
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-white/80 border border-bloomPink/20 text-bloomBlack placeholder-bloomPink/40 focus:outline-none focus:ring-2 focus:ring-bloomPink/30 focus:border-transparent transition-all duration-200 shadow-sm min-h-[80px] text-sm"
                      placeholder="Any special notes or details?"
                    />
                    <div className="absolute bottom-3 right-3 text-bloomPink/40">
                      
                    </div>
                  </div>
                </div>

                {/* Single Date toggle */}
                <motion.div
                layout
                className="flex justify-between items-center mb-2"
                >
                  <p className="font-bold text-bloomBlack">Single Date</p>
                  
                  <motion.div
                  layout
                  className={`w-[45px] h-[24px] p-[2px] flex flex-row items-center rounded-full relative"
                    ${(isSingleDate)
                    ? "justify-end"
                    : "justify-start"
                  }`}
                  style={{ background: isSingleDate ? "linear-gradient(to right, #F875AA, #F3E198)" : "#474747" }}
                  animate={{ background: isSingleDate ? "linear-gradient(to right, #F875AA, #F3E198)" : "#474747" }}
                  transition={{ duration: 0 }}
                  onClick={handleSingleDay}
                  >
                    <motion.div
                    layout
                    className="bg-white p-[10px] rounded-full"
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {!isSingleDate && (
                    <motion.div
                    key="day-selector"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    >
                      {/* Day selection */}
                      <div className="flex items-center gap-2 mb-2">
                        <input type="radio" name="daySelection" className="appearance-none w-3 h-3 border border-bloomBlack/50 rounded-full checked:bg-bloomPink checked:border-bloomPink checked:shadow transition-all duration-300 cursor-pointer" />
                        <span className="font-bold text-bloomBlack">Everyday</span>
                      </div>

                      <div className="flex justify-evenly w-full gap-2 mb-2">
                        {["Su", "M", "Tu", "W", "Th", "F", "Sa"].map((day, i) => (
                          <div
                            key={i}
                            className={`w-[32px] h-[32px] flex items-center justify-center rounded-full text-sm font-bold ${
                              weekly.includes(day)
                                ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow scale-105"
                                : "border border-bloomPink text-bloomPink hover:bg-bloomYellow/50 hover:scale-105"
                            }`}
                            onClick={() => {
                              (!weekly.includes(day))
                              ? setWeekly(weekly.concat(day))
                              : setWeekly(weekly.filter((x) => x !== day))
                            }}
                          >
                            {day}
                          </div>
                        ))}
                      </div>

                      {/* Interval option */}
                      <div className="flex items-center mb-2">
                        <input type="radio" name="daySelection" className="appearance-none w-3 h-3 border border-bloomBlack/50 rounded-full checked:bg-bloomPink checked:border-bloomPink checked:shadow transition-all duration-300 cursor-pointer" />
                        <div className="px-1"></div>
                        <span className="font-bold text-bloomBlack pr-1">Every</span>
                        <input 
                            type="number"
                            className="w-[30px] outline-none text-left text-bloomblack placeholder-bloomBlack font-bold bg-White rounded-[6px] focus:border-bloomBlack focus:shadow"
                            placeholder="_"
                            value={interval}
                            onChange={(e) => setInterval(Number(e.target.value))}
                            min={0}
                          />
                        <span className="font-bold text-bloomBlack">days</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Whole Day toggle */}
                <motion.div
                layout
                className="flex justify-between items-center mb-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                >
                  <p className="font-bold text-bloomBlack">Whole Day</p>
                  
                  <motion.div 
                  layout
                  onClick={handleWholeDay}
                  className={`w-[45px] h-[24px] p-[2px] flex flex-row items-center rounded-full relative"
                    ${(isWholeDay)
                    ? "justify-end"
                    : "justify-start"
                  }`}
                  style={{ background: isWholeDay ? "linear-gradient(to right, #F875AA, #F3E198)" : "#474747" }}
                  animate={{ background: isWholeDay ? "linear-gradient(to right, #F875AA, #F3E198)" : "#474747" }}
                  >
                    <motion.div
                    layout
                    className="bg-white p-[10px] rounded-full"
                    transition={{ type: "spring", stiffness: 200, damping: 20 }}
                    />
                  </motion.div>
                </motion.div>

                <AnimatePresence>
                  {!isWholeDay && (
                    <motion.div
                    layout
                    key="time-selector"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    >
                      <div className="flex justify-center items-center gap-1 mb-2">
                        <div className="flex flex-col justify-center items-center w-[80px]">
                          <input 
                            type="number"
                            className="w-full outline-none text-3xl text-center text-bloomBlack placeholder-bloomBlack font-bold bg-White rounded-[6px] focus:border-bloomPink focus:shadow"
                            placeholder={String(timeHr).padStart(2, "0")}
                            value={String(timeHr).padStart(2, "0")}
                            onChange={(e) => {
                              let hrInput = Number(e.target.value);
                              if (hrInput < 1) {
                                hrInput = 1
                              } else if (hrInput > 12) {
                                hrInput = 12
                              }
                              setTimeHr(hrInput)
                            }}
                          />
                        </div>
                        <div className="text-center text-3xl font-bold text-bloomBlack">
                          :
                        </div>
                        <div className="flex flex-col justify-center items-center w-[80px]">
                          <input 
                            type="number"
                            className="w-full outline-none text-3xl text-center text-bloomBlack placeholder-bloomBlack font-bold bg-White rounded-[6px] focus:border-bloomPink focus:shadow"
                            placeholder={String(timeMin).padStart(2, "0")}
                            value={String(timeMin).padStart(2, "0")}
                            onChange={(e) => {
                              let minInput = Number(e.target.value);
                              if (minInput < 0) {
                                minInput = 0
                              } else if (minInput > 59) {
                                minInput = 59
                              }
                              setTimeMin(minInput)
                            }}
                          />
                        </div>
                        <div className="flex flex-col justify-center items-center w-[50px]">
                          <div 
                          className="w-[50px] text-center text-3xl font-bold text-bloomBlack placeholder-bloomBlack"
                          onClick={handleChangeClock}
                          >
                            {clock}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Date & Time Picker */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-bloomBlack/80">Schedule</label>
                  <div className="flex items-center space-x-3">
                    <div className="relative flex-1">
                      <button
                        onClick={handelStartDate}
                        className="w-full py-1.5 rounded-lg bg-gradient-to-r from-bloomPink to-bloomYellow text-white font-medium hover:opacity-90 transition-all duration-200 shadow hover:shadow-md text-sm"
                      >
                        {dateStart}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full">
              {/* Buttons */}
              <div className="flex justify-between gap-4">
                <button className="w-28 py-1.5 rounded-full border border-bloomPink text-bloomPink font-bold hover:bg-pink-50 transition text-sm">
                  Cancel
                </button>
                <button 
                  onClick={handleAdd}
                  className="bg-gradient-to-r from-bloomPink to-bloomYellow text-white px-5 py-1.5 rounded-full font-medium hover:opacity-90 transition-opacity text-sm"
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


