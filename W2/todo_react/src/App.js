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
    <div className="app-container">
      <div className="todo-app">
        <h1 className="title">Todo App</h1>
        <div className="task-input">
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            placeholder="Enter a task"
            className="task-input-field"
          />
          <button onClick={addTask} className="add-task-button">
            Add Task
          </button>
        </div>
        <ul className="task-list">
          {tasks.length === 0 ? (
            <p className="default-message">
              Add something and get started with your day!
            </p>
          ) : (
            tasks.map((t, index) => (
              <li key={index} className="task-item">
                <span className="task-text">{t}</span>
                <button onClick={() => removeTask(index)} className="remove-task-button">
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
