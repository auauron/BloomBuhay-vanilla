import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";

type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

export default function ToDoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  // Add new task
  function handleAddTask() {
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: Date.now(),
      title: newTaskTitle.trim(),
      completed: false,
      createdAt: new Date().toLocaleString(),
    };
    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle("");
  }

  // Delete task
  function handleDeleteTask(id: number) {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  }

  // Toggle checkbox
  function handleToggleTask(id: number) {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
      <div className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-white p-4 rounded-[20px] shadow-lg relative items-center">

        {/* Header */}
        <h3 className="text-2xl mb-2 text-white font-bold flex items-center justify-center gap-4 p-2">
          <span className="flex-1 text-center">To Do List</span>

          {/* Add Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddTask}
            className="rounded-full bg-white/20 hover:bg-white/30 p-2 transition"
          >
            <PlusCircle className="w-8 h-8 text-white" />
          </motion.button>
        </h3>

        {/* Task List Container */}
        <div className="bg-white rounded-xl p-4 text-[#474747] max-h-[500px] overflow-y-auto shadow-inner">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-400 italic">No tasks yet.</p>
          ) : (
            tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-between bg-gradient-to-r from-pink-50 to-pink-100 p-3 rounded-xl mb-3 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task.id)}
                    className="w-5 h-5 accent-bloomPink cursor-pointer"
                  />
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
                  <span>{task.createdAt}</span>
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

        {/* Hidden input for creating tasks (appears when typing) */}
        {newTaskTitle.length >= 0 && (
          <input
            type="text"
            placeholder="Type new task..."
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            className="mt-3 w-full p-3 rounded-xl bg-white/80 focus:bg-white outline-none text-gray-700"
            onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
          />
        )}
      </div>
    </motion.div>
  );
}
