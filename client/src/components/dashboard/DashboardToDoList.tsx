import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { plannerService } from "../../services/plannerService";
import { CheckCircle2, Circle, Calendar, AlertCircle, Eye } from "lucide-react";

interface Task {
    id: number;
    title: string;
    completed: boolean;
    createdAt: string;
    date: string;
}

export default function DashboardToDoList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchTasks();
    }, []);

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
                setError(response.error || "Failed to fetch tasks");
            }
        } catch (e) {
            setError("Failed to load tasks");
            console.error("Fetch tasks error:", e);
        } finally {
            setLoading(false);
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
                setTasks((prev) => prev.map((t) => t.id === id ? { ...t, completed: !t.completed } : t));
            } else {
                setError(response.error || "Failed to update task");
            }
        } catch (e) {
            setError("Failed to update task");
            console.error("Update task failed:", e);
        }
    }

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const month = date.getMonth(); 
        const day = date.getDate();    
        return `${months[month]} ${day}`;
    };
    return (
        <div className="bg-gradient-to-r from-bloomPink to-bloomYellow p-[16px] rounded-2xl shadow-lg h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl ml-2 font-bold text-white">Upcoming Tasks</h3>
                <a 
                    href="/planner" 
                    className="bg-white/20 hover:bg-white/30 p-2 rounded-lg transition-all duration-200 group"
                    title="View all tasks in Planner"
                >
                    <Eye className="w-5 h-5 text-white group-hover:scale-110 transition-transform duration-200" />
                </a>
            </div>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[14px] p-4 flex-1"
            >
                {error && (
                    <div className="flex items-center gap-2 p-3 mb-4 bg-red-50 text-red-700 rounded-xl text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                <div className="space-y-3">
                    {loading ? (
                        <div className="flex flex-col gap-3">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                                    <div className="w-5 h-5 bg-gray-200 rounded-full"></div>
                                    <div className="flex-1 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : tasks.length === 0 ? (
                        <div className="text-center py-8">
                            <p className="text-gray-600 font-medium">No tasks yet</p>
                            <p className="text-gray-500 text-sm mt-1">Add some in the Planner!</p>
                        </div>
                    ) : (
                        tasks.map((task) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex items-center gap-3 p-3 bg-pink-50 rounded-xl hover:bg-pink-100 transition-colors group border border-gray-200"
                            >
                                <button
                                    onClick={() => handleToggleTask(task.id)}
                                    className="flex-shrink-0 transition-all duration-200 hover:scale-110"
                                >
                                    {task.completed ? (
                                        <CheckCircle2 className="w-5 h-5 text-bloomPink fill-current" />
                                    ) : (
                                        <Circle className="w-5 h-5 text-gray-400 group-hover:text-bloomPink" />
                                    )}
                                </button>
                                
                                <div className="flex-1 min-w-0">
                                    <p className={`font-medium text-sm transition-all duration-200 ${
                                        task.completed 
                                            ? 'line-through text-gray-400' 
                                            : 'text-gray-800'
                                    }`}>
                                        {task.title}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {formatDate(task.date)}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            </motion.div>
        </div>
    );
}