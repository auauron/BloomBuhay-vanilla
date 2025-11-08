import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Task } from "../../../types/plan";
import { SingleDate } from "../../../types/plan";
import { DateFrame } from "../../../types/plan";
import { Repeated } from "../../../types/plan";
import { Weekly } from "../../../types/plan";
import { Custom } from "../../../types/plan";
import { AddTaskModalProps } from "../../../types/plan";

export default function AddTaskModal({ isOpen, onClose, onAdd }: AddTaskModalProps) {
  const [form, setForm] = useState<Task>({
      task: null,
      description: "",
      isCompleted: false,
      taskType: null
  });

  // const handleSave = () => {
  //   onAdd(form);
  //   onClose();

  // // Load the task into form when editing
  // useEffect(() => {
  //     setForm({
  //       task: "",
  //       description: "",
  //       isCompleted: false,
  //       taskType: null
  //     });
  //   }
  // );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "number" ? Number(value) : value,
    }));
  };

  // const handleSubmit = () => {
  //   if (!form.task || !form.startDate) return;
  //   onSave(form, isEditing);
  //   onClose();
  // };

  return (
    0
  //   <AnimatePresence>
  //     {isOpen && (
  //       <>
  //         {/* Background Overlay */}
  //         <motion.div
  //           className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
  //           initial={{ opacity: 0 }}
  //           animate={{ opacity: 1 }}
  //           exit={{ opacity: 0 }}
  //           onClick={onClose}
  //         />

  //         {/* Modal Card */}
  //         <motion.div
  //           className="fixed z-50 top-1/2 left-1/2 w-[90%] max-w-md -translate-x-1/2 -translate-y-1/2 
  //             bg-white rounded-2xl shadow-lg overflow-hidden"
  //           initial={{ opacity: 0, scale: 0.9, y: 20 }}
  //           animate={{ opacity: 1, scale: 1, y: 0 }}
  //           exit={{ opacity: 0, scale: 0.9, y: 20 }}
  //           transition={{ duration: 0.2 }}
  //         >
  //           {/* Header */}
  //           <div className="flex justify-between items-center p-4 bg-gradient-to-r from-bloomPink to-bloomYellow">
  //             <h2 className="text-xl font-semibold text-white">
  //               {isEditing ? "Edit Task" : "Add Task"}
  //             </h2>
  //             <button onClick={onClose} className="text-white hover:opacity-80">
  //               <X className="w-6 h-6" />
  //             </button>
  //           </div>

  //           {/* Body */}
  //           <div className="p-6 space-y-4">
  //             <div>
  //               <label className="block text-sm font-medium text-gray-600 mb-1">
  //                 Task Title
  //               </label>
  //               <input
  //                 type="text"
  //                 name="task"
  //                 value={form.task}
  //                 onChange={handleChange}
  //                 placeholder="Enter task title"
  //                 className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-bloomPink focus:outline-none"
  //               />
  //             </div>

  //             <div>
  //               <label className="block text-sm font-medium text-gray-600 mb-1">
  //                 Description
  //               </label>
  //               <textarea
  //                 name="description"
  //                 value={form.description ?? ""}
  //                 onChange={handleChange}
  //                 placeholder="Optional description..."
  //                 className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-bloomPink focus:outline-none"
  //               />
  //             </div>

  //             <div className="flex gap-4">
  //               <div className="flex-1">
  //                 <label className="block text-sm font-medium text-gray-600 mb-1">
  //                   Start Date
  //                 </label>
  //                 <input
  //                   type="date"
  //                   name="startDate"
  //                   value={form.startDate}
  //                   onChange={handleChange}
  //                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-bloomPink focus:outline-none"
  //                 />
  //               </div>
  //               <div className="flex-1">
  //                 <label className="block text-sm font-medium text-gray-600 mb-1">
  //                   End Date
  //                 </label>
  //                 <input
  //                   type="date"
  //                   name="endDate"
  //                   value={form.endDate ?? ""}
  //                   onChange={handleChange}
  //                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-bloomPink focus:outline-none"
  //                 />
  //               </div>
  //             </div>

  //             <div className="flex gap-4">
  //               <div className="flex-1">
  //                 <label className="block text-sm font-medium text-gray-600 mb-1">
  //                   Interval (days)
  //                 </label>
  //                 <input
  //                   type="number"
  //                   name="interval"
  //                   value={form.interval}
  //                   onChange={handleChange}
  //                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-bloomPink focus:outline-none"
  //                 />
  //               </div>
  //               <div className="flex-1">
  //                 <label className="block text-sm font-medium text-gray-600 mb-1">
  //                   Delay (mins)
  //                 </label>
  //                 <input
  //                   type="number"
  //                   name="delay"
  //                   value={form.delay}
  //                   onChange={handleChange}
  //                   className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-bloomPink focus:outline-none"
  //                 />
  //               </div>
  //             </div>
  //           </div>

  //           {/* Footer */}
  //           <div className="flex justify-end p-4 bg-gray-50 border-t border-gray-200">
  //             <button
  //               onClick={onClose}
  //               className="px-4 py-2 rounded-lg mr-2 border border-gray-300 hover:bg-gray-100"
  //             >
  //               Cancel
  //             </button>
  //             <button
  //               onClick={handleSubmit}
  //               className="px-4 py-2 rounded-lg bg-gradient-to-r from-bloomPink to-bloomYellow text-white font-semibold shadow hover:opacity-90"
  //             >
  //               {isEditing ? "Update Task" : "Save Task"}
  //             </button>
  //           </div>
  //         </motion.div>
  //       </>
  //     )}
  //   </AnimatePresence>
  );
}
