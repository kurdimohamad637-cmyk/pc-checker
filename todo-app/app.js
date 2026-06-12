// Local Storage Keys
const STORAGE_KEY = 'todos';

// Initial load
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    document.getElementById('todoInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') addTodo();
    });
});

// Add Todo
function addTodo() {
    const input = document.getElementById('todoInput');
    const text = input.value.trim();

    if (!text) {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    let todos = getTodos();
    todos.push(todo);
    saveTodos(todos);
    input.value = '';
    input.focus();
    renderTodos();
    updateStats();
}

// Get Todos from Local Storage
function getTodos() {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
}

// Save Todos to Local Storage
function saveTodos(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Toggle Todo Completion
function toggleTodo(id) {
    let todos = getTodos();
    todos = todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos(todos);
    renderTodos();
    updateStats();
}

// Delete Todo
function deleteTodo(id) {
    if (confirm('Delete this task?')) {
        let todos = getTodos();
        todos = todos.filter(todo => todo.id !== id);
        saveTodos(todos);
        renderTodos();
        updateStats();
    }
}

// Clear Completed Todos
function clearCompleted() {
    if (confirm('Delete all completed tasks?')) {
        let todos = getTodos();
        todos = todos.filter(todo => !todo.completed);
        saveTodos(todos);
        renderTodos();
        updateStats();
    }
}

// Delete All Todos
function deleteAllTodos() {
    if (confirm('Delete ALL tasks? This cannot be undone!')) {
        localStorage.removeItem(STORAGE_KEY);
        renderTodos();
        updateStats();
    }
}

// Filter Todos
function filterTodos(filter) {
    const buttons = document.querySelectorAll('.filter-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');

    let todos = getTodos();
    let filtered = todos;

    if (filter === 'active') {
        filtered = todos.filter(todo => !todo.completed);
    } else if (filter === 'completed') {
        filtered = todos.filter(todo => todo.completed);
    }

    displayTodos(filtered);
}

// Load and Render Todos
function loadTodos() {
    renderTodos();
    updateStats();
}

function renderTodos() {
    const todos = getTodos();
    displayTodos(todos);
}

function displayTodos(todosToDisplay) {
    const todosList = document.getElementById('todosList');
    const emptyState = document.getElementById('emptyState');

    todosList.innerHTML = '';

    if (todosToDisplay.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    todosToDisplay.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        li.innerHTML = `
            <input 
                type="checkbox" 
                class="todo-checkbox" 
                ${todo.completed ? 'checked' : ''}
                onchange="toggleTodo(${todo.id})"
            >
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
        `;
        todosList.appendChild(li);
    });
}

// Update Stats
function updateStats() {
    const todos = getTodos();
    const completedCount = todos.filter(t => t.completed).length;
    const activeCount = todos.length - completedCount;

    document.getElementById('totalCount').textContent = todos.length;
    document.getElementById('activeCount').textContent = activeCount;
    document.getElementById('completedCount').textContent = completedCount;
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}