import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2, CheckCircle2 } from 'lucide-react';
import { plannerService } from "../../services/plannerService";
import AddTaskModal from "./modal/AddTask";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  date: string;
  scheduledAt: string;
};

export default function ToDoList({ selectedDate }: { selectedDate?: string | null }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, [selectedDate]);

  async function fetchTasks() {
    try {
      setLoading(true);
      setError(null);

      const response = await plannerService.getTasks();

      if (response.success && response.data) {
        const transformedTasks = response.data.map((task) => {
          // Parse the date string from the backend
          const taskDate = new Date(task.date);
          
          // Format date part
          const formattedDate = taskDate.toLocaleDateString([], { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
          });
          
          // Format time part - this will now show the actual stored time
          const formattedTime = taskDate.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit',
            hour12: true  // Explicitly set 12-hour format
          });

          return {
            id: task.id,
            title: task.title,
            completed: task.isCompleted,
            scheduledAt: `${formattedDate} ${formattedTime}`, // Combined display
            date: task.date,
          };
        });

        const filtered = selectedDate
          ? transformedTasks.filter((t) => {
              const onlyDate = t.date.split("T")[0];  
              return onlyDate === selectedDate;
            })
          : transformedTasks;

        setTasks(filtered);
      } else {
        setError(response.error || "Failed to fetch tasks");
      }
    } catch (err) {
      setError("Failed to load tasks");
      console.error("Fetch tasks error:", err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddTask() {
    if (!newTaskTitle.trim()) return;

    try {
      let dateToUse: string;

      if (selectedDate) {
        // selected a date and add current time
        const now = new Date();
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        dateToUse = `${selectedDate}T${hh}:${mm}:00`;
      } else {
        // no selected date → use current ISO timestamp
        dateToUse = new Date().toISOString();
      }

      const response = await plannerService.createTask({
        title: newTaskTitle.trim(),
        description: "",
        date: dateToUse,
      });

      if (response.success && response.data) {
        await fetchTasks();
        setNewTaskTitle("");
      } else {
        setError(response.error || "Failed to create task");
      }
    } catch (err) {
      setError("Failed to create task");
      console.error("Create task error:", err);
    }
  }

  async function handleDeleteTask(id: number) {
    try {
      const response = await plannerService.deleteTask(id);

      if (response.success) {
        setTasks((prev) => prev.filter((task) => task.id !== id));
      } else {
        setError(response.error || "Failed to delete task");
      }
    } catch (err) {
      setError("Failed to delete task");
      console.error("Delete task error:", err);
    }
  }

  async function handleToggleTask(id: number) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const response = await plannerService.updateTask(id, {
        isCompleted: !task.completed,
      });

      if (response.success) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, completed: !t.completed } : t
          )
        );
      } else {
        setError(response.error || "Failed to update task");
      }
    } catch (err) {
      setError("Failed to update task");
      console.error("Update task error:", err);
    }
  }

  return !isAdding ? (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-gradient-to-r from-bloomPink to-bloomYellow text-white p-4 h-[588px] rounded-[20px] shadow-lg">
        {/* Header */}
        <h3 className="text-2xl mb-2 text-white font-bold flex items-center justify-center gap-4 p-2">
          <span className="flex-1 text-center">To Do List</span>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsAdding(!isAdding)}
          >
            <PlusCircle className="w-8 h-8 text-white" />
          </motion.button>
        </h3>

        <div className="h-[500px] flex flex-col gap-3">
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          <div className="flex flex-col justify-start items-center bg-white rounded-xl p-4 text-[#474747] h-full overflow-y-auto shadow-inner">
            {loading ? (
              <p className="text-center text-gray-400 italic">Loading tasks...</p>
            ) : tasks.length === 0 ? (
              <p className="text-center text-gray-400 italic">No tasks yet.</p>
            ) : (
              tasks.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center w-full justify-between bg-gradient-to-r from-pink-50 to-pink-100 p-3 rounded-xl mb-3 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleToggleTask(task.id)}
                      className="flex-shrink-0 transition-all duration-200 hover:scale-110"
                    >
                      {task.completed ? (
                        <CheckCircle2 className="w-5 h-5 text-bloomPink fill-current" />
                      ) : (
                        <svg
                          className="w-5 h-5 text-gray-400"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <circle
                            cx="12"
                            cy="12"
                            r="9"
                            stroke="currentColor"
                            strokeWidth="2"
                          />
                        </svg>
                      )}
                    </button>
                    <span
                      className={`text-lg ${
                        task.completed
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {task.title}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{task.scheduledAt}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDeleteTask(task.id)}
                      className="text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </motion.div>
              ))
            )}
          </div>

          <input
            type="text"
            placeholder="Type new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="w-full p-3 rounded-xl bg-white/80 focus:bg-white outline-none text-gray-700"
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />
        </div>
      </div>
    </motion.div>
  ) : (
    <AddTaskModal
    onClose={() => setIsAdding(false)} 
    onTaskAdded={fetchTasks}
    selectedDate={selectedDate}
    />
  );
}