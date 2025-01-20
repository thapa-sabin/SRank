// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState('');

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask('');
    }
  };

  const removeTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-6">
        <h1 className="text-2xl font-bold text-center text-gray-700 mb-4">Todo App</h1>
        <div className="flex gap-2 mb-4">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
            className="flex-1 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTask}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
        <ul className="space-y-2">
          {tasks.length === 0 ? (
            <p className="text-center text-gray-500">
              Add something and get started with your day!
            </p>
          ) : (
            tasks.map((t, index) => (
              <li
                key={index}
                className="flex justify-between items-center p-2 border-b border-gray-200"
              >
                <span className="text-gray-700">{t}</span>
                <button
                  onClick={() => removeTask(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

export default App;
