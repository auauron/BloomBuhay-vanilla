import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";
import { Task, BloomDate, AddTaskModalProps } from "../../../types/plan";
import { getFullDate, getNow, translateBloomdate } from "../PlannerFuntions";

export default function AddTaskModal( {onClose} : {onClose: () => void} ) {

  const now: BloomDate = getNow()
  const today: string = getFullDate(getNow())
  
  const [form, setForm] = useState<Task>({
    id: "null",
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

  // const handleAdd = () => {
  //   onAdd(form)
  // }

  const handelStartDate = () => {
    
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
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
            <div className="flex gap-2 mb-2 items-center">
              <input
                id="title"
                type="text"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-bloomBlack/50 outline-none text-bloomBlack placeholder-bloomBlack/50 text-[12px] font-bold bg-White shadow-md rounded-full px-2 focus:placeholder-bloomPink/50 focus:border-bloomPink focus:text-bloomPink focus:bg-bloomYellow/25"
              />
              <div className="p-3 bg-bloomPink rounded-full"></div>
            </div>

            {/* Description input */}
            <textarea
              key="description"
              placeholder="Description..."
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mb-2 resize-none overflow-hidden border border-bloomBlack/50 outline-none text-bloomBlack placeholder-bloomBlack/50 text-[12px] font-bold bg-White shadow-md rounded-[12px] p-2 focus:placeholder-bloomPink/50 focus:border-bloomPink focus:text-bloomPink focus:bg-bloomYellow/25"
            />

            <AnimatePresence>
              <div className="relative flex justify-center items-center mb-2">
                {(!isSingleDate 
                  ?
                  <motion.div
                  key="single1"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center gap-2"
                  >
                    <button 
                    className="py-1 px-2 text-[12px] font-bold text-bloomBlack rounded-full border border-bloomBlack/50 hover:bg-gradient-to-r hover:from-bloomPink hover:to-bloomYellow hover:text-white transition-all duration-300 cursor-pointer select-none hover:shadow hover:border-bloomBlack/0 hover:scale-105"
                    >
                      {dateStart}
                    </button>
                    <ChevronRight className="text-bloomPink" />
                    <button className="py-1 px-2 text-[12px] font-bold text-bloomBlack rounded-full border border-bloomBlack/50 hover:bg-gradient-to-r hover:from-bloomPink hover:to-bloomYellow hover:text-white transition-all duration-300 cursor-pointer select-none hover:shadow hover:border-bloomBlack/0 hover:scale-105">
                      {dateEnd}
                    </button>
                  </motion.div>
                  : 
                  <motion.div
                  key="single2"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center justify-center"
                  >
                    <button className="py-1 px-2 text-[12px] font-bold text-bloomBlack rounded-full border border-bloomBlack/50 hover:bg-gradient-to-r hover:from-bloomPink hover:to-bloomYellow hover:text-white transition-all duration-300 cursor-pointer select-none hover:shadow hover:border-bloomBlack/0 hover:scale-105">
                        {dateStart}
                      </button>
                  </motion.div>
                )}
              </div>
            </AnimatePresence>

            <AnimatePresence>
              {/* Single Date toggle */}
              <div key="single-toggle" className="flex justify-between items-center mb-2">
                <p className="font-bold text-bloomBlack">Single Date</p>
                <motion.button 
                className={
                  (isSingleDate)
                  ? "w-[45px] h-[24px] p-[2px] flex justify-end flex-row items-center bg-gradient-to-r from-bloomPink to-bloomYellow rounded-full relative"
                  : "w-[45px] h-[24px] p-[2px] flex justify-start flex-row items-center bg-bloomBlack rounded-full relative"
                }
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                onClick={handleSingleDay}
                >
                  <div className="bg-white p-[10px] rounded-full"/>
                </motion.button>
              </div>
            </AnimatePresence>

            {!isSingleDate && (
            <div>
              {/* Day selection */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-2 mb-2">
                <input type="radio" name="daySelection" className="appearance-none w-3 h-3 border border-bloomBlack/50 rounded-full checked:bg-bloomPink checked:border-bloomPink checked:shadow transition-all duration-300 cursor-pointer" />
                <span className="font-bold text-bloomBlack">Everyday</span>
              </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex justify-evenly w-full gap-2 mb-2">
                {["Su", "M", "Tu", "W", "Th", "F", "Sa"].map((day, i) => (
                  <div
                    key={i}
                    className={`w-[32px] h-[32px] flex items-center justify-center rounded-full text-sm font-bold ${
                      ["Sa"].includes(day)
                        ? "bg-gradient-to-r from-bloomPink to-bloomYellow text-white shadow scale-105"
                        : "border border-bloomPink text-bloomPink hover:bg-bloomYellow/50 hover:scale-105"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
              </motion.div>

              {/* Interval option */}
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center mb-2">
                <input type="radio" name="daySelection" className="appearance-none w-3 h-3 border border-bloomBlack/50 rounded-full checked:bg-bloomPink checked:border-bloomPink checked:shadow transition-all duration-300 cursor-pointer" />
                <div className="px-1"></div>
                <span className="font-bold text-bloomBlack">Every</span>
                <input 
                    type="text"
                    className="w-[24px] outline-none text-center text-bloomblack placeholder-bloomBlack font-bold bg-White rounded-[6px] focus:border-bloomBlack focus:shadow"
                    placeholder="_"
                  />
                <span className="font-bold text-bloomBlack">days</span>
              </div>
              </motion.div>
            </div>
            )}
            
            {/* Whole Day toggle */}
            <div className="flex justify-between items-center mb-2 transition-all duration-300 ease-in-out">
              <p className="font-bold text-bloomBlack">Whole Day</p>
              <button className={
                (isWholeDay)
                ? "w-[45px] h-[24px] p-[2px] flex justify-end flex-row items-center bg-gradient-to-r from-bloomPink to-bloomYellow rounded-full relative"
                : "w-[45px] h-[24px] p-[2px] flex justify-start flex-row items-center bg-bloomBlack rounded-full relative"
              }
              onClick={handleWholeDay}
              >
                <div className="bg-white p-[10px] rounded-full" />
              </button>
            </div>
            
            {!isWholeDay && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex justify-center items-center gap-1 mb-2">
                  <div className="flex flex-col justify-center items-center w-[50px]">
                    <input 
                      type="text"
                      className="w-full outline-none text-3xl text-center text-bloomBlack placeholder-bloomBlack font-bold bg-White rounded-[6px] focus:border-bloomPink focus:shadow"
                      placeholder="00"
                      maxLength={2}
                    />
                  </div>
                  <div className="text-center text-3xl font-bold text-bloomBlack">
                    :
                  </div>
                  <div className="flex flex-col justify-center items-center w-[50px]">
                    <input 
                      type="text"
                      className="w-full outline-none text-3xl text-center text-bloomBlack placeholder-bloomBlack font-bold bg-White rounded-[6px] focus:border-bloomPink focus:shadow"
                      placeholder="00"
                      maxLength={2}
                    />
                  </div>
                  <div className="flex flex-col justify-center items-center w-[50px]">
                    <div className="w-[50px] text-center text-3xl font-bold text-bloomBlack placeholder-bloomBlack">
                      AM
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="w-full">
            {/* Buttons */}
            <div className="flex justify-between gap-4">
              <button className="w-32 py-2 rounded-full border border-bloomPink text-bloomPink font-bold hover:bg-pink-50 transition">
                Cancel
              </button>
              <button className="w-32 py-2 rounded-full bg-gradient-to-r from-bloomPink to-bloomYellow text-white font-bold shadow hover:opacity-90 transition">
                Add
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}


