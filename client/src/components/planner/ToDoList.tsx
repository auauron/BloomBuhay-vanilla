import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { PlusCircle, Trash2 } from "lucide-react";
import { plannerService } from "../../services/plannerService";
import AddTaskModal from "./modal/AddTask";
import { Task, BloomDate, BloomTime, ToDoListState } from "../../types/plan";
import { getFullDate, getNow, getTime, taskID, translateBloomdate } from "./PlannerFuntions";

export default function ToDoList({ selectedMode, selectedDate }: ToDoListState) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false)

  const now = translateBloomdate(getNow())

  // Fetch tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  async function fetchTasks() {
    try {
      setLoading(true);
      setError(null);
      const response = await plannerService.getTasks();
      
      if (response.success && response.data) {
        // Transform API data to component format
        const transformedTasks = response.data.map((task) => ({
          id: task.id,
          task: task.task,
          description: task.description,
          isCompleted: task.isCompleted,
          startDate: task.startDate,
          endDate: task.endDate,
          days: task.days,
          interval: task.interval,
          time: task.time,
          dateCreated: task.dateCreated
        }));
        setTasks(transformedTasks);
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

  // Add new task
  async function handleAddTask() {
    if (!newTaskTitle.trim()) return;

    try {
      const response = await plannerService.createTask({
        id: taskID(getNow(), getTime()),
        title: newTaskTitle,
        description: null,
        isCompleted: false,
        startDate: (selectedDate === null) ? getNow() : selectedDate
      });

      if (response.success && response.data) {
        const newTask: Task = {
          id: response.data.id,
          task: response.data.task,
          description: response.data.description,
          isCompleted: response.data.isCompleted,
          startDate: response.data.startDate,
          endDate: response.data.endDate,
          days: response.data.days,
          interval: response.data.interval,
          time: response.data.time,
          dateCreated: response.data.dateCreated
        };
        setTasks((prev) => [newTask, ...prev]);
        setNewTaskTitle("");
      } else {
        setError(response.error || "Failed to create task");
      }
    } catch (err) {
      setError("Failed to create task");
      console.error("Create task error:", err);
    }
  }

  // Delete task
  async function handleDeleteTask(id: string) {
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

  // Toggle checkbox
  async function handleToggleTask(id: string) {
    const task = tasks.find((t) => t.id === id);
    if (!task) return;

    try {
      const response = await plannerService.updateTask(id, {
        isCompleted: !task.isCompleted,
      });

      if (response.success) {
        setTasks((prev) =>
          prev.map((t) =>
            t.id === id ? { ...t, completed: !t.isCompleted } : t
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

  return (
    !isAdding 
      ? (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <div className="bg-gradient-to-r from-bloomPink to-bloomYellow text-white p-4 h-[588px] rounded-[20px] shadow-lg">

          {/* Header */}
          <h3 className="text-2xl mb-2 text-white font-bold flex items-center justify-center gap-4 p-2">
            <span className="flex-1 text-center">To Do List</span>

            {/* Add Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsAdding(!isAdding)}
            >
              <PlusCircle className="w-8 h-8 text-white" />
            </motion.button>
          </h3>

          <div className="h-[500px] flex flex-col gap-3">
          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-100 text-red-700 rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Task List Container */}
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
                    <input
                      type="checkbox"
                      checked={task.isCompleted}
                      onChange={() => handleToggleTask(task.id)}
                      className="w-5 h-5 accent-bloomPink cursor-pointer"
                    />
                    <span
                      className={`text-lg ${
                        task.isCompleted
                          ? "line-through text-gray-400"
                          : "text-gray-800"
                      }`}
                    >
                      {task.task}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>{task.dateCreated}</span>
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
              className="w-full p-3 rounded-xl bg-white/80 focus:bg-white outline-none text-gray-700"
              onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
            />
          )}
          </div>
        </div>
        </motion.div>
    ) : (
      <AddTaskModal
      onClose = {() => setIsAdding(!isAdding)}
      onCancel={() => setIsAdding(!isAdding)}
      onAdd={(task) => {
        setTasks(tasks.concat(task))
        setIsAdding(!isAdding)
      }}
      selectDate={selectedDate}
      selectMode={() => selectedMode()}
      />
    )
  );
}
