import React, { useState, useEffect } from "react";
import { motion, AnimatePresence, number } from "framer-motion";
import { X, ChevronRight, ChevronUp, ChevronDown, Target } from "lucide-react";
import { Task, BloomDate, AddTaskModalProps, BloomTime } from "../../../types/plan";
import { getFullDate, getNow, getTime, taskID, translateBloomdate } from "../PlannerFuntions";

export default function AddTaskModal({ onClose, onCancel, onAdd, selectDate, selectMode } : AddTaskModalProps) {

  const now: BloomDate = getNow()
  const nowTime: BloomTime = getTime()
  const selectedMonth = (selectDate) ? selectDate : now

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [isSingleDate, setSingleDate] = useState(true);
  const [isWholeDay, setWholeDay] = useState(true);
  const [dateStart, setDateStart] = useState(now)
  const [dateEnd, setDateEnd] = useState(now)
  const [days, setDays] = useState<number[]>([])
  const [interval, setInterval] = useState(0)
  const [timeHr, setTimeHr] = useState(6)
  const [timeMin, setTimeMin] = useState(0)
  const [clock, setClock] = useState("AM")

    
  const [form, setForm] = useState<Task>({
    id: taskID(now, nowTime),
    task: title,
    description: description,
    isCompleted: false,
    startDate: dateStart,
    endDate: dateEnd,
    days: days,
    interval: interval,
    time: { hour: timeHr, min: timeMin, sec: 0 } as BloomTime

  });

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

  const handleCancel = () => {
    setForm({
    id: taskID( now, nowTime),
    task: "Task",
    description: null,
    isCompleted: false,
    startDate: now
    })
    onClose();
  }

  const handleAdd = () => {
    onAdd(form)
  }

  const handelStartDate = () => {
    
  }

  const handleSelectDate = () => {
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-4 rounded-[20px] shadow-lg relative items-center">
          {/* Header */}
          <h3 className="text-2xl text-white font-bold flex items-center justify-center gap-4 p-2 mb-2">
            <span className="flex-1 text-center">Add Task</span>

            {/* Add Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClose}
            >
              <X className="w-8 h-8 text-white" />
            </motion.button>
          </h3>

          <div className=" flex flex-col items-center content-center justify-between bg-white rounded-xl p-4 text-[#474747] h-[500px] overflow-y-auto">
            <div className="w-full">
              {/* Title input */}
              <motion.div
              className="flex gap-2 mb-2 items-center"
              >
                <input
                  id="title"
                  type="text"
                  placeholder="Title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full border border-bloomBlack/50 outline-none text-bloomBlack placeholder-bloomBlack/50 text-[12px] font-bold bg-White shadow-md rounded-full px-2 focus:placeholder-bloomPink/50 focus:border-bloomPink focus:text-bloomPink focus:bg-bloomYellow/25"
                />
                <div className="p-3 bg-bloomPink rounded-full"></div>
              </motion.div>

              {/* Description input */}
              <textarea
                key="description"
                placeholder="Description..."
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full mb-2 resize-none overflow-hidden border border-bloomBlack/50 outline-none text-bloomBlack placeholder-bloomBlack/50 text-[12px] font-bold bg-White shadow-md rounded-[12px] p-2 focus:placeholder-bloomPink/50 focus:border-bloomPink focus:text-bloomPink focus:bg-bloomYellow/25"
              />
              <motion.div transition={{ duration: 0.3, ease: "easeOut"}}>
                <AnimatePresence>
                  <div className="relative flex justify-center items-center mb-2">
                    {(!isSingleDate ?
                      <motion.div
                      key="single1"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center gap-2"
                      >
                        <button 
                        className="py-1 px-2 text-[12px] font-bold text-bloomBlack rounded-full border border-bloomBlack/50 hover:bg-gradient-to-r hover:from-bloomPink hover:to-bloomYellow hover:text-white transition-all duration-300 cursor-pointer select-none hover:shadow hover:border-bloomBlack/0 hover:scale-105"
                        >
                          {getFullDate(dateStart)}
                        </button>
                        <ChevronRight className="text-bloomPink" />
                        <button className="py-1 px-2 text-[12px] font-bold text-bloomBlack rounded-full border border-bloomBlack/50 hover:bg-gradient-to-r hover:from-bloomPink hover:to-bloomYellow hover:text-white transition-all duration-300 cursor-pointer select-none hover:shadow hover:border-bloomBlack/0 hover:scale-105">
                          {getFullDate(dateEnd)}
                        </button>
                      </motion.div>
                      : 
                      <motion.div
                      key="single2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center justify-center"
                      >
                        <button className="py-1 px-2 text-[12px] font-bold text-bloomBlack rounded-full border border-bloomBlack/50 hover:bg-gradient-to-r hover:from-bloomPink hover:to-bloomYellow hover:text-white transition-all duration-300 cursor-pointer select-none hover:shadow hover:border-bloomBlack/0 hover:scale-105">
                            {getFullDate(dateStart)}
                          </button>
                      </motion.div>
                    )}
                  </div>
                </AnimatePresence>
                
                
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

                      <div className="flex justify-evenly w-full gap-2 mb-2 cursor-pointer">
                        {["Su", "M", "Tu", "W", "Th", "F", "Sa"].map((day, i) => (
                          <div
                            key={i}
                            className={`w-[32px] h-[32px] flex items-center justify-center rounded-full text-sm font-bold ${
                              days.includes(i)
                                ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow scale-105"
                                : "border border-bloomPink text-bloomPink hover:bg-bloomYellow/50 hover:scale-105"
                            }`}
                            onClick={() => {
                              (!days.includes(i))
                              ? setDays(days.concat(i))
                              : setDays(days.filter((x) => x !== i))
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
              </motion.div>
            </div>

            <div className="w-full">
              {/* Buttons */}
              <div className="flex justify-between gap-4">
                <motion.button
                className="w-32 py-2 rounded-full border border-bloomPink text-bloomPink font-bold hover:bg-pink-50 transition"
                onClick={handleCancel}
                >
                  Cancel
                </motion.button>
                <motion.button
                className="w-32 py-2 rounded-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white font-bold shadow hover:opacity-90 transition"
                onClick={handleAdd}
                >
                  Add
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}


