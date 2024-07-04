

const API_URL = 'http://localhost:3000/tasks';

async function addTask() {
  const taskInput = document.getElementById('taskInput');
  const taskList = document.getElementById('taskList').querySelector('tbody');

  if (taskInput.value.trim() === '') {
    alert('Please enter a task.');
    return;
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name: taskInput.value }),
  });

  const newTask = await response.json();

  const tr = createTaskRow(newTask);
  taskList.appendChild(tr);
  taskInput.value = '';
}

async function completeTask(taskId) {
  const response = await fetch(`${API_URL}/${taskId}/complete`, {
    method: 'PATCH',
  });

  const updatedTask = await response.json();

  const taskList = document.getElementById('taskList').querySelector('tbody');
  const rows = Array.from(taskList.children);
  const row = rows.find(row => row.getAttribute('data-task-id') === String(taskId));
  if (row) {
    row.classList.add('completed');
    taskList.removeChild(row);
    taskList.insertBefore(row, taskList.firstChild);
    const checkbox = row.querySelector('.complete-checkbox');
    if (checkbox) {
      checkbox.checked = true;
      checkbox.disabled = true;
    }
  }
}

async function removeTask(taskId) {
  const response = await fetch(`${API_URL}/${taskId}`, {
    method: 'DELETE',
  });

  const removedTask = await response.json();

  const taskList = document.getElementById('taskList').querySelector('tbody');
  const rows = Array.from(taskList.children);
  const row = rows.find(row => row.getAttribute('data-task-id') === String(taskId));
  if (row) {
    taskList.removeChild(row);
    renumberTasks();
  }
}

function createTaskRow(task) {
  const tr = document.createElement('tr');
  tr.setAttribute('data-task-id', task.id);

  const idTd = document.createElement('td');
  idTd.textContent = task.id;
  tr.appendChild(idTd);

  const taskTd = document.createElement('td');
  taskTd.textContent = task.name;
  tr.appendChild(taskTd);

  const completeTd = document.createElement('td');
  const completeCheckbox = document.createElement('input');
  completeCheckbox.type = 'checkbox';
  completeCheckbox.className = 'complete-checkbox';
  completeCheckbox.onclick = function () {
    completeTask(task.id);
  };
  completeTd.appendChild(completeCheckbox);
  tr.appendChild(completeTd);

  const actionsTd = document.createElement('td');

  const completeButton = document.createElement('button');
  completeButton.textContent = 'Complete';
  completeButton.className = 'complete-btn';
  completeButton.onclick = function () {
    completeTask(task.id);
  };

  const removeButton = document.createElement('button');
  removeButton.textContent = 'Remove';
  removeButton.className = 'remove-btn';
  removeButton.onclick = function () {
    removeTask(task.id);
  };

  actionsTd.appendChild(completeButton);
  actionsTd.appendChild(removeButton);
  tr.appendChild(actionsTd);

  return tr;
}

async function fetchTasks() {
  const response = await fetch(API_URL);
  const tasks = await response.json();

  const taskList = document.getElementById('taskList').querySelector('tbody');
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const tr = createTaskRow(task);
    taskList.appendChild(tr);
  });
}

function handleKeyPress(event) {
  if (event.key === 'Enter') {
    addTask();
  }
}

function renumberTasks() {
  const taskList = document.getElementById('taskList').querySelector('tbody');
  const rows = taskList.querySelectorAll('tr');
  let taskIdCounter = 1;
  rows.forEach(row => {
    const idCell = row.querySelector('td:first-child');
    idCell.textContent = taskIdCounter++;
  });
}

document.addEventListener('DOMContentLoaded', fetchTasks);
