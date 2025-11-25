import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { plannerService  } from "../../services/plannerService";

interface Task{
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    date: string
}

export default function DashboardToDoList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTasks();
    }, [])

    async function fetchTasks() {
        try {
            setLoading(true);
            setError(null);
            const response = await plannerService.getTasks();

            if (response.success && response.data) {
                const transformedTasks = response.data.map((task) => ({
                    id: task.id,
                    title: task.title,
                    completed: task.isCompleted,
                    createdAt: new Date(task.createdAt).toLocaleString(),
                    date: task.date,                    
                }));

                setTasks(transformedTasks.slice(0, 3));
            } else {
                setError(response.error || "Failed to fetch tasks")
            }
        } catch (e) {
            setError("Failed to load tasks")
            console.error("Fetch tasks error:", e)
        } finally {
            setLoading(false)
        }
    }

    async function handleToggleTask(id: number) {
        const task = tasks.find((t)=>t.id === id);
        if (!task) return;

        try {
            const response = await plannerService.updateTask(id, {
                isCompleted: !task.completed,
            })

            if (response.success) {
                setTasks((prev)=>prev.map((t)=>t.id===id ? { ...t, completed: !t.completed} : t ))
            } else {
                setError(response.error || "Failed to update task");
            }
        } catch (e) {
            setError("Failed to update task")
            console.error("Update task failed:", e)
        }
    }

    return (
        <motion.div
            initial={{opacity: 0, y: 10}}
            animate={{ opacity: 1, y: 0}}
            className="bg-gradient-to-r from-bloomPink via-[#F5ABA1] to-bloomYellow text-pink-800 p-4 md:p-6 rounded-[20px] shadow-md relative"
        >
            <h3 className="text-xl md:text-2xl mb-2 md:mb-3 text-white font-bold pr-10  "> Upcoming Tasks </h3>

            {error && (
                <div className="p-2 mb-3 bg-red-100 text-red-700 rounded text-sm">{error}</div>
            )}

            <div className="space-y-2">
                {loading ? (
                    <p className="text-center text-bloomBlack text-sm py-4">
                        Loading tasks...
                    </p>
                ) : tasks.length === 0 ? ( 
                    <p className="text-center text-bloomBlack text-sm py-4">
                        No tasks yet. Add some in the Planner!
                    </p>
                ) : (
                    tasks.map((task) => (
                        <div
                            key={task.id}
                             className="flex items-center p-2  rounded-lg transition-colors"
                        >
                            <input
                            type="checkbox"
                            checked={task.completed}
                            onChange={() => handleToggleTask(task.id)}
                            className="w-4 h-4 text-bloomPink rounded focus:ring-bloomPink"
                            />  
                            <span 
                                className={`ml-3 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}
                            >
                                {task.title}
                            </span>
                        </div>
                    ))
                )}
                </div>

                {tasks.length > 0 && (
                <div className="mt-3 text-center">
                    <a 
                        href="/planner" 
                        className="text-sm text-bloomWhite hover:underline"
                    >
                        View all tasks in Planner →
                    </a>
                </div>
                )}
        </motion.div>
    )
}
    

