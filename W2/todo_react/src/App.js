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
    <div className="min-h-screen bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 flex justify-center items-center p-4">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-lg p-8">
        <h1 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Todo App
        </h1>
        <div className="flex gap-3 mb-5">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
            className="flex-1 border border-gray-300 rounded-lg p-3 text-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            onClick={addTask}
            className="bg-indigo-500 text-white px-6 py-3 rounded-lg hover:bg-indigo-600 transition duration-300"
          >
            Add Task
          </button>
        </div>
        <div className="text-center text-gray-500 mb-4">
          {tasks.length === 0 && (
            <p>✨ Add something and get started with your day!</p>
          )}
        </div>
        <ul className="space-y-4">
          {tasks.map((t, index) => (
            <li
              key={index}
              className="flex justify-between items-center bg-gray-50 p-4 rounded-lg shadow-md hover:bg-gray-100 transition duration-200"
            >
              <span className="text-lg text-gray-800">{t}</span>
              <button
                onClick={() => removeTask(index)}
                className="text-red-500 hover:text-red-600 transition duration-300"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
