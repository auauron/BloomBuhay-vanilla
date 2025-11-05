import React, { useState } from "react";

type Task = {
  id: number;
  text: string;
  date: Date;
  completed: boolean;
};

type ToDoListProps = {
  selectedDate: Date;
  addTask: (task: Task) => void;
  tasks: Task[];
};

export default function TodoList( {selectedDate, addTask, tasks}: ToDoListProps ) {
  const [text, setText] = useState("");

  const formattedDate = selectedDate.toLocaleDateString();

  function handleAdd(): void {
    if (!text.trim()) return;
    addTask({
      id: Date.now(),
      text,
      date: selectedDate,
      completed: false,
    });
    setText("");
  }

  const filteredTasks = tasks.filter(
    (task) =>
      new Date(task.date).toDateString() === selectedDate.toDateString()
  );

  return (
    <div className="p-4 bg-white rounded-2xl shadow-lg border border-pink-100">
      <h2 className="text-lg font-semibold text-gray-700 mb-2">
        Tasks for {formattedDate}
      </h2>

      <div className="flex mb-3">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Add a new task..."
          className="flex-grow border rounded-l-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button
          onClick={handleAdd}
          className="bg-pink-500 text-white px-4 rounded-r-lg hover:bg-pink-600"
        >
          Add
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-gray-400 text-sm">No tasks for this date.</p>
      ) : (
        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex justify-between items-center bg-pink-50 px-3 py-2 rounded-lg"
            >
              <span>{task.text}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
