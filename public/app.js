/* eslint-disable antfu/if-newline */
/* eslint-disable no-alert */
// --- DOM Elements ---
const todoList = document.getElementById('todo-list');
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');

// --- Functions ---

async function updateTodo(id, isCompleted) {
  // Optimistically update the UI
  const todoElement = todoList.querySelector(`[data-id="${id}"]`).closest('li');
  if (todoElement) {
    const textSpan = todoElement.querySelector('span');
    const deleteButton = todoElement.querySelector('.btn-error');
    textSpan.classList.toggle('line-through', isCompleted);
    deleteButton.classList.toggle('hidden', !isCompleted);
  }

  try {
    await fetch(`todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isCompleted }),
    });
  } catch (error) {
    console.error('Failed to update todo:', error);
    alert('Failed to update task. Syncing with server.');
    fetchTodos(); // Re-sync on failure
  }
}

async function deleteTodo(id) {
  // Optimistically remove from UI
  const todoElement = todoList.querySelector(`[data-id="${id}"]`).closest('li');
  if (todoElement) {
    todoElement.remove();
  }

  try {
    await fetch(`todos/${id}`, { method: 'DELETE' });
  } catch (error) {
    console.error('Failed to delete todo:', error);
    alert('Failed to delete task. Syncing with server.');
    fetchTodos(); // Re-sync on failure
  }
}

function renderTodos(todos) {
  todoList.innerHTML = ''; // Clear the list
  todos.forEach(todo => {
    const todoElement = document.createElement('li');
    todoElement.className = 'flex items-center gap-2';
    todoElement.innerHTML = `
        <input
          type="checkbox"
          class="checkbox checkbox-accent"
          data-id="${todo._id}"
          ${todo.isCompleted ? 'checked' : ''}
        />
        <span class="text-3xl text-blue-400 ${todo.isCompleted ? 'line-through' : ''}">
          ${todo.text}
        </span>
        <button class="btn btn-error btn-sm ${!todo.isCompleted ? 'hidden' : ''}" data-id="${todo._id}" type="button">Delete</button>
    `;
    todoList.appendChild(todoElement);
  });
}

async function fetchTodos() {
  try {
    const response = await fetch('/todos');

    if (!response.ok) throw new Error('Network response was not ok');
    const todos = await response.json();
    renderTodos(todos);
  } catch (error) {
    console.error('Failed to fetch todos:', error);
    alert('Could not load tasks from the server.');
  }
}

// --- Event Listeners ---

todoForm.addEventListener('submit', async event => {
  event.preventDefault();
  const text = todoInput.value.trim();
  const submitButton = todoForm.querySelector('button');

  if (text) {
    submitButton.disabled = true;
    todoInput.disabled = true;
    try {
      // We don't need to wait for fetchTodos, the UI will update optimistically
      const response = await fetch('/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!response.ok) throw new Error('Failed to create todo');

      const newTodo = await response.json();
      // Instead of re-fetching, just add the new element
      renderTodos([
        newTodo,
        ...Array.from(todoList.children).map(li => ({
          _id: li.querySelector('[data-id]').dataset.id,
          text: li.querySelector('span').textContent.trim(),
          isCompleted: li.querySelector('input').checked,
        })),
      ]);

      todoInput.value = '';
    } catch (error) {
      console.error('Failed to create todo:', error);

      alert('Failed to add new task. Please try again.');
    } finally {
      submitButton.disabled = false;
      todoInput.disabled = false;
      todoInput.focus();
    }
  }
});

todoList.addEventListener('click', event => {
  const target = event.target;
  const id = target.dataset.id;

  if (target.matches('.btn-error')) {
    deleteTodo(id);
  }

  if (target.matches('.checkbox')) {
    const isCompleted = target.checked;
    updateTodo(id, isCompleted);
  }
});

// --- Initial Load ---
fetchTodos();
