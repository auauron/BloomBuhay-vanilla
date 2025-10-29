// TodoListComponent.tsx
import React, { useState } from 'react';

interface Task {
  id: number;
  text: string;
  completed: boolean;
  date: Date;
}

interface TodoProps {
  tasks: Task[];
  addTask: (text: string, date: Date) => void;
  toggleTaskCompletion: (id: number) => void;
  currentDate: Date;
}

const TodoListComponent: React.FC<TodoProps> = ({ tasks, addTask, toggleTaskCompletion, currentDate }) => {
  const [newTaskText, setNewTaskText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText, currentDate);
      setNewTaskText('');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit">Add Task</button>
      </form>
      <ul>
        {tasks.map((task) => (
          <li key={task.id} style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTaskCompletion(task.id)}
            />
            {task.text}
          </li>
        ))}
        {tasks.length === 0 && <p>No tasks for this day!</p>}
      </ul>
    </div>
  );
};

export default TodoListComponent;