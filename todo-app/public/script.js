/* =========================================================
   NOTES & TASKS — frontend
   Talks to the Express backend (server.js) which persists
   everything to data/todos.json.
   ========================================================= */
const API = '/api/todos';

const taskForm = document.getElementById('taskForm');
const taskInput = document.getElementById('taskInput');
const priorityInput = document.getElementById('priorityInput');
const dueInput = document.getElementById('dueInput');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filtersBox = document.getElementById('filters');
const clearCompletedBtn = document.getElementById('clearCompleted');

let todos = [];
let currentFilter = 'all';

/* ---------- API calls ---------- */
async function fetchTodos() {
  try {
    const res = await fetch(API);
    todos = await res.json();
    render();
  } catch (err) {
    taskList.innerHTML = `<p class="error-text">Couldn't reach the server. Is it running? (npm start)</p>`;
  }
}

async function addTodo(text, priority, dueDate) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, priority, dueDate })
  });
  const newTodo = await res.json();
  todos.unshift(newTodo);
  render();
}

async function updateTodo(id, patch) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(patch)
  });
  const updated = await res.json();
  const idx = todos.findIndex(t => t.id === id);
  if (idx !== -1) todos[idx] = updated;
  render();
}

async function deleteTodo(id) {
  await fetch(`${API}/${id}`, { method: 'DELETE' });
  todos = todos.filter(t => t.id !== id);
  render();
}

async function clearCompleted() {
  await fetch(API, { method: 'DELETE' });
  todos = todos.filter(t => !t.completed);
  render();
}

/* ---------- rendering ---------- */
function formatDue(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

function render() {
  const visible = todos.filter(t => {
    if (currentFilter === 'active') return !t.completed;
    if (currentFilter === 'completed') return t.completed;
    return true;
  });

  const activeCount = todos.filter(t => !t.completed).length;
  taskCount.textContent = `${activeCount} active · ${todos.length} total`;

  if (visible.length === 0) {
    taskList.innerHTML = `<p class="hint">${todos.length === 0 ? 'No tasks yet — add your first one above ✨' : 'Nothing to show for this filter.'}</p>`;
    return;
  }

  taskList.innerHTML = '';
  visible.forEach(todo => {
    const item = document.createElement('div');
    item.className = 'task-item' + (todo.completed ? ' completed' : '');

    const due = formatDue(todo.dueDate);

    item.innerHTML = `
      <div class="task-check ${todo.completed ? 'checked' : ''}" data-id="${todo.id}"></div>
      <div class="task-body">
        <div class="task-text" data-id="${todo.id}">${escapeHtml(todo.text)}</div>
        <div class="task-sub">
          <span class="badge ${todo.priority}">${todo.priority}</span>
          ${due ? `<span class="badge due">📅 ${due}</span>` : ''}
        </div>
      </div>
      <div class="task-actions">
        <button class="icon-btn edit" data-id="${todo.id}" title="Edit">✏️</button>
        <button class="icon-btn delete" data-id="${todo.id}" title="Delete">🗑️</button>
      </div>
    `;
    taskList.appendChild(item);
  });
}

function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

/* ---------- events ---------- */
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;
  addTodo(text, priorityInput.value, dueInput.value);
  taskForm.reset();
  priorityInput.value = 'medium';
});

taskList.addEventListener('click', (e) => {
  const id = e.target.dataset.id;
  if (!id) return;

  if (e.target.classList.contains('task-check')) {
    const todo = todos.find(t => t.id === id);
    updateTodo(id, { completed: !todo.completed });
  }

  if (e.target.classList.contains('delete')) {
    deleteTodo(id);
  }

  if (e.target.classList.contains('edit')) {
    const textEl = document.querySelector(`.task-text[data-id="${id}"]`);
    const currentText = textEl.textContent;
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'task-text-input';
    input.value = currentText;
    textEl.replaceWith(input);
    input.focus();

    const save = () => {
      const newText = input.value.trim();
      if (newText && newText !== currentText) {
        updateTodo(id, { text: newText });
      } else {
        render();
      }
    };
    input.addEventListener('blur', save);
    input.addEventListener('keydown', (ev) => {
      if (ev.key === 'Enter') input.blur();
      if (ev.key === 'Escape') render();
    });
  }
});

filtersBox.addEventListener('click', (e) => {
  if (!e.target.classList.contains('filter-btn')) return;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  e.target.classList.add('active');
  currentFilter = e.target.dataset.filter;
  render();
});

clearCompletedBtn.addEventListener('click', clearCompleted);

fetchTodos();
