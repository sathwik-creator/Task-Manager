const taskForm = document.getElementById('taskForm');
const taskTitle = document.getElementById('taskTitle');
const taskDescription = document.getElementById('taskDescription');
const taskDueDate = document.getElementById('taskDueDate');
const taskDueTime = document.getElementById('taskDueTime');
const taskReminder = document.getElementById('taskReminder');
const taskReminderTime = document.getElementById('taskReminderTime');
const taskId = document.getElementById('taskId');
const submitBtn = document.getElementById('submitBtn');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const formTitle = document.getElementById('form-title');
const taskList = document.getElementById('taskList');
const emptyState = document.getElementById('emptyState');

const STORAGE_KEY = 'taskManagerTasks';
let tasks = [];
let reminderTimers = new Map();

function loadTasks() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      tasks = JSON.parse(saved);
    } catch (e) {
      tasks = [];
    }
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function formatDateTime(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (isNaN(d)) return '—';
  return d.toLocaleString([], {
    hour12: true,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getDueText(task) {
  if (!task.dueAt) return 'No due date';
  const now = Date.now();
  const due = new Date(task.dueAt).getTime();
  if (isNaN(due)) return 'Invalid date';
  if (due < now && !task.done) return `Overdue • ${formatDateTime(task.dueAt)}`;
  return `Due • ${formatDateTime(task.dueAt)}`;
}

function scheduleReminder(task) {
  if (reminderTimers.has(task.id)) {
    clearTimeout(reminderTimers.get(task.id));
    reminderTimers.delete(task.id);
  }

  if (!task.remindAt || task.done) return;

  const remindTime = new Date(task.remindAt).getTime();
  const now = Date.now();
  const delay = remindTime - now;

  if (delay <= 0) {
    // show immediately if missed
    showReminder(task);
    return;
  }

  const timer = setTimeout(() => {
    showReminder(task);
    reminderTimers.delete(task.id);
  }, delay);

  reminderTimers.set(task.id, timer);
}

function showReminder(task) {
  const message = `Reminder: ${task.title}${task.description ? ' — ' + task.description : ''}`;
  alert(message);
  const card = document.querySelector(`[data-id='${task.id}']`);
  if (card) {
    card.classList.add('reminder-active');
    setTimeout(() => card.classList.remove('reminder-active'), 3200);
  }
}

function renderTasks() {
  taskList.innerHTML = '';
  if (!tasks.length) {
    emptyState.classList.remove('hide');
    return;
  }
  emptyState.classList.add('hide');

  tasks.forEach((task) => {
    const tpl = document.getElementById('taskCardTemplate');
    const node = tpl.content.cloneNode(true);
    const card = node.querySelector('.task-card');
    card.dataset.id = task.id;
    card.classList.toggle('completed', task.done);

    const titleEl = node.querySelector('.task-title');
    const descEl = node.querySelector('.task-desc');
    const dueEl = node.querySelector('.due-label');
    const reminderEl = node.querySelector('.reminder-label');
    const editBtn = node.querySelector('.btn-edit');
    const deleteBtn = node.querySelector('.btn-delete');

    titleEl.textContent = task.title || 'Untitled';
    descEl.textContent = task.description || '';
    dueEl.textContent = getDueText(task);
    reminderEl.textContent = task.remindAt ? `Reminder • ${formatDateTime(task.remindAt)}` : 'No reminder';

    editBtn.addEventListener('click', () => startEdit(task.id));
    deleteBtn.addEventListener('click', () => removeTask(task.id));

    card.addEventListener('dblclick', () => {
      toggleTaskDone(task.id);
    });

    taskList.appendChild(node);
  });
}

function clearForm() {
  taskTitle.value = '';
  taskDescription.value = '';
  taskDueDate.value = '';
  taskDueTime.value = '';
  taskReminder.checked = false;
  taskReminderTime.value = '';
  taskReminderTime.disabled = true;
  taskId.value = '';
  formTitle.textContent = 'Add a New Task';
  submitBtn.textContent = 'Add Task';
  cancelEditBtn.classList.add('hide');
}

function getDateTimeString(date, time) {
  if (!date) return null;
  if (!time) {
    return new Date(date).toISOString();
  }
  const dt = new Date(`${date}T${time}`);
  if (isNaN(dt)) return null;
  return dt.toISOString();
}

function addOrUpdateTask(e) {
  e.preventDefault();

  const title = taskTitle.value.trim();
  if (!title) {
    alert('Task title is required');
    return;
  }

  const description = taskDescription.value.trim();
  const dueAt = getDateTimeString(taskDueDate.value, taskDueTime.value);
  const remindAt = taskReminder.checked ? taskReminderTime.value : '';

  const setRemindAt = remindAt ? new Date(remindAt).toISOString() : '';

  const id = taskId.value;

  if (id) {
    const idx = tasks.findIndex((t) => t.id === id);
    if (idx === -1) return;
    tasks[idx] = {
      ...tasks[idx],
      title,
      description,
      dueAt,
      remindAt: setRemindAt,
    };
    scheduleReminder(tasks[idx]);
  } else {
    const newTask = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title,
      description,
      dueAt,
      remindAt: setRemindAt,
      createdAt: new Date().toISOString(),
      done: false,
    };
    tasks.unshift(newTask);
    scheduleReminder(newTask);
  }

  saveTasks();
  renderTasks();
  clearForm();
}

function removeTask(id) {
  if (!confirm('Delete this task?')) return;
  tasks = tasks.filter((t) => t.id !== id);
  if (reminderTimers.has(id)) {
    clearTimeout(reminderTimers.get(id));
    reminderTimers.delete(id);
  }
  saveTasks();
  renderTasks();
}

function startEdit(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  taskTitle.value = task.title;
  taskDescription.value = task.description;

  if (task.dueAt) {
    const d = new Date(task.dueAt);
    taskDueDate.value = d.toISOString().slice(0, 10);
    taskDueTime.value = d.toISOString().slice(11, 16);
  } else {
    taskDueDate.value = '';
    taskDueTime.value = '';
  }

  if (task.remindAt) {
    taskReminder.checked = true;
    taskReminderTime.disabled = false;
    taskReminderTime.value = new Date(task.remindAt).toISOString().slice(0, 16);
  } else {
    taskReminder.checked = false;
    taskReminderTime.disabled = true;
    taskReminderTime.value = '';
  }

  taskId.value = task.id;
  formTitle.textContent = 'Update Task';
  submitBtn.textContent = 'Update Task';
  cancelEditBtn.classList.remove('hide');
}

function toggleTaskDone(id) {
  const task = tasks.find((t) => t.id === id);
  if (!task) return;
  task.done = !task.done;
  saveTasks();
  renderTasks();
  if (task.done && reminderTimers.has(id)) {
    clearTimeout(reminderTimers.get(id));
    reminderTimers.delete(id);
  } else {
    scheduleReminder(task);
  }
}

taskReminder.addEventListener('change', () => {
  taskReminderTime.disabled = !taskReminder.checked;
  if (!taskReminder.checked) taskReminderTime.value = '';
});

cancelEditBtn.addEventListener('click', (e) => {
  e.preventDefault();
  clearForm();
});

window.addEventListener('beforeunload', () => {
  reminderTimers.forEach((timer) => clearTimeout(timer));
});

loadTasks();
renderTasks();

// schedule future reminders for loaded tasks
tasks.forEach((task) => scheduleReminder(task));

taskForm.addEventListener('submit', addOrUpdateTask);
