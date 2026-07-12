/* =========================================================
   TO-DO / NOTES APP — Express backend
   Persists tasks to data/todos.json (no external DB needed)
   ========================================================= */
const express = require('express');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 4000;
const DATA_FILE = path.join(__dirname, 'data', 'todos.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

/* ---------- helpers ---------- */
function readTodos() {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    return JSON.parse(raw || '[]');
  } catch (err) {
    return [];
  }
}

function writeTodos(todos) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(todos, null, 2));
}

/* ---------- API routes ---------- */

// GET all todos
app.get('/api/todos', (req, res) => {
  res.json(readTodos());
});

// POST a new todo
app.post('/api/todos', (req, res) => {
  const { text, priority, dueDate } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Task text is required.' });
  }
  const todos = readTodos();
  const newTodo = {
    id: crypto.randomUUID(),
    text: text.trim(),
    priority: priority || 'medium',
    dueDate: dueDate || '',
    completed: false,
    createdAt: new Date().toISOString()
  };
  todos.unshift(newTodo);
  writeTodos(todos);
  res.status(201).json(newTodo);
});

// PUT (update) a todo — text, completed, priority, dueDate
app.put('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const idx = todos.findIndex(t => t.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'Task not found.' });

  const { text, completed, priority, dueDate } = req.body;
  if (text !== undefined) todos[idx].text = text.trim();
  if (completed !== undefined) todos[idx].completed = completed;
  if (priority !== undefined) todos[idx].priority = priority;
  if (dueDate !== undefined) todos[idx].dueDate = dueDate;

  writeTodos(todos);
  res.json(todos[idx]);
});

// DELETE a todo
app.delete('/api/todos/:id', (req, res) => {
  const todos = readTodos();
  const filtered = todos.filter(t => t.id !== req.params.id);
  if (filtered.length === todos.length) {
    return res.status(404).json({ error: 'Task not found.' });
  }
  writeTodos(filtered);
  res.json({ success: true });
});

// DELETE all completed
app.delete('/api/todos', (req, res) => {
  const todos = readTodos().filter(t => !t.completed);
  writeTodos(todos);
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`✅ To-Do app running at http://localhost:${PORT}`);
});
