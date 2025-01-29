const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'tasks_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('MySQL Connected');
});

// Get all tasks
app.get('/tasks', (req, res) => {
    db.query('SELECT * FROM tasks', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Get task by ID
app.get('/tasks/:id', (req, res) => {
    const taskId = req.params.id;
    db.query('SELECT * FROM tasks WHERE id = ?', [taskId], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ message: 'Task not found' });
        }
    });
});

// Add a new task
app.post('/tasks', (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: 'Task title is required' });
    db.query('INSERT INTO tasks (title) VALUES (?)', [title], (err, result) => {
        if (err) throw err;
        res.json({ id: result.insertId, title });
    });
});

// Update a task
app.put('/tasks/:id', (req, res) => {
    const { title } = req.body;
    db.query('UPDATE tasks SET title = ? WHERE id = ?', [title, req.params.id], (err) => {
        if (err) throw err;
        res.json({ message: 'Task updated' });
    });
});

// Delete a task
app.delete('/tasks/:id', (req, res) => {
    db.query('DELETE FROM tasks WHERE id = ?', [req.params.id], (err) => {
        if (err) throw err;
        res.json({ message: 'Task deleted' });
    });
});

// Start the server
app.listen(5000, () => console.log('Server running on port 5000'));
