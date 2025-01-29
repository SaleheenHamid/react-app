// Frontend: App.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function App() {
    const [tasks, setTasks] = useState([]);
    const [newTask, setNewTask] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/tasks').then(res => setTasks(res.data));
    }, []);

    const addTask = () => {
        if (!newTask.trim()) return;
        axios.post('http://localhost:5000/tasks', { title: newTask }).then(res => {
            setTasks([...tasks, res.data]);
            setNewTask('');
        });
    };

    const updateTask = (id, title) => {
        axios.put(`http://localhost:5000/tasks/${id}`, { title }).then(() => {
            setTasks(tasks.map(task => task.id === id ? { ...task, title } : task));
        });
    };

    const deleteTask = (id) => {
        axios.delete(`http://localhost:5000/tasks/${id}`).then(() => {
            setTasks(tasks.filter(task => task.id !== id));
        });
    };

    return (
        <div className="p-4 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Task Manager</h1>
            <input className="border p-2 w-full" value={newTask} onChange={(e) => setNewTask(e.target.value)} />
            <button className="bg-blue-500 text-white px-4 py-2 mt-2" onClick={addTask}>Add Task</button>
            <ul>
                {tasks.map(task => (
                    <li key={task.id} className="flex justify-between items-center mt-2 border p-2">
                        <input
                            className="border p-1 flex-1"
                            value={task.title}
                            onChange={(e) => updateTask(task.id, e.target.value)}
                        />
                        <button className="bg-red-500 text-white px-2 ml-2" onClick={() => deleteTask(task.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}