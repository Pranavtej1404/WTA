// Navigation Function
function showSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => {
        if (sec.id === sectionId) {
            sec.classList.remove('hidden');
        } else {
            sec.classList.add('hidden');
        }
    });
}

// Modal Functions
function closeModal(modalId) {
    document.getElementById(modalId).classList.add('hidden');
    
}

// Open Modal
document.getElementById('add-task').addEventListener('click', () => {
    document.getElementById('task-modal').classList.remove('hidden');
});

document.getElementById('add-task-dashboard').addEventListener('click', () => {
    document.getElementById('task-dashboard-modal').classList.remove('hidden');
});

// Task Management
let tasks = [];

// Load tasks from localStorage
if (localStorage.getItem('tasks')) {
    tasks = JSON.parse(localStorage.getItem('tasks'));
    displayTasks();
    updateDashboard();
}

// Add Task
document.getElementById('task-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const due = document.getElementById('task-due').value;
    const priority = document.getElementById('task-priority').value;

    const task = { title, desc, due, priority, completed: false };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
    updateDashboard();
    closeModal('task-modal');
    this.reset();
});

// Add Task from Dashboard
document.getElementById('task-dashboard-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const title = document.getElementById('dashboard-task-title').value;
    const desc = document.getElementById('dashboard-task-desc').value;
    const due = document.getElementById('dashboard-task-due').value;
    const priority = document.getElementById('dashboard-task-priority').value;

    const task = { title, desc, due, priority, completed: false };
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
    updateDashboard();
    closeModal('task-dashboard-modal');
    this.reset();
});

// Display Tasks
function displayTasks() {
    const taskList = document.getElementById('task-list');
    const todayTasks = document.getElementById('today-tasks');
    taskList.innerHTML = '';
    todayTasks.innerHTML = '';

    const today = new Date().toISOString().split('T')[0];

    tasks.forEach((task, index) => {
        // Task List
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-title">${task.title}</div>
            <div class="task-desc">${task.desc}</div>
            <div class="task-due">Due: ${task.due}</div>
            <div class="task-priority">Priority: ${formatPriority(task.priority)}</div>
            <button onclick="toggleComplete(${index})">${task.completed ? 'Mark Incomplete' : 'Mark Complete'}</button>
            <button onclick="deleteTask(${index})">Delete</button>
        `;
        taskList.appendChild(li);

        // Today's Tasks
        if (task.due === today) {
            const todayLi = document.createElement('li');
            todayLi.innerHTML = `
                <div class="task-title">${task.title}</div>
                <div class="task-priority">Priority: ${formatPriority(task.priority)}</div>
            `;
            todayTasks.appendChild(todayLi);
        }
    });
}

// Format Priority
function formatPriority(priority) {
    switch(priority) {
        case 'urgent-important':
            return 'Urgent & Important';
        case 'important':
            return 'Important but Not Urgent';
        case 'urgent':
            return 'Urgent but Not Important';
        case 'low':
            return 'Not Urgent & Not Important';
        default:
            return '';
    }
}

// Toggle Task Completion
function toggleComplete(index) {
    tasks[index].completed = !tasks[index].completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
    updateDashboard();
}

// Delete Task
function deleteTask(index) {
    tasks.splice(index, 1);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
    updateDashboard();
}

// Update Dashboard Progress
function updateDashboard() {
    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;
    const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

    document.getElementById('progress').style.width = `${progress}%`;
    document.getElementById('progress-text').innerText = `${progress}% completed`;

    // Update Today's Tasks
    const today = new Date().toISOString().split('T')[0];
    const todayTasks = tasks.filter(task => task.due === today);
    const todayTasksList = document.getElementById('today-tasks');
    todayTasksList.innerHTML = '';
    todayTasks.forEach(task => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="task-title">${task.title}</div>
            <div class="task-priority">Priority: ${formatPriority(task.priority)}</div>
        `;
        todayTasksList.appendChild(li);
    });
}

// Pomodoro Timer
let pomodoroInterval;
let pomodoroTime = 25 * 60; // 25 minutes

const timerDisplay = document.getElementById('timer');
const startPomodoroBtn = document.getElementById('start-pomodoro');
const resetPomodoroBtn = document.getElementById('reset-pomodoro');

startPomodoroBtn.addEventListener('click', () => {
    if (!pomodoroInterval) {
        pomodoroInterval = setInterval(() => {
            if (pomodoroTime <= 0) {
                clearInterval(pomodoroInterval);
                pomodoroInterval = null;
                alert("Pomodoro session ended! Take a break.");
            } else {
                pomodoroTime--;
                updatePomodoroDisplay();
            }
        }, 1000);
    }
});

resetPomodoroBtn.addEventListener('click', () => {
    clearInterval(pomodoroInterval);
    pomodoroInterval = null;
    pomodoroTime = 25 * 60;
    updatePomodoroDisplay();
});

function updatePomodoroDisplay() {
    const minutes = Math.floor(pomodoroTime / 60);
    const seconds = pomodoroTime % 60;
    timerDisplay.innerText = `${pad(minutes)}:${pad(seconds)}`;
}

function pad(num) {
    return num < 10 ? '0' + num : num;
}

// Initialize Pomodoro Display
updatePomodoroDisplay();

// Mindfulness Timer
let mindfulnessInterval;
let mindfulnessTime = 0;

const mindfulnessDisplay = document.getElementById('mindfulness-display');
const startMindfulnessBtn = document.getElementById('start-mindfulness');
const resetMindfulnessBtn = document.getElementById('reset-mindfulness');
const mindfulnessDurationInput = document.getElementById('mindfulness-duration');

startMindfulnessBtn.addEventListener('click', () => {
    const minutes = parseInt(mindfulnessDurationInput.value);
    if (isNaN(minutes) || minutes <= 0) {
        alert("Please enter a valid duration in minutes.");
        return;
    }
    mindfulnessTime = minutes * 60;
    if (!mindfulnessInterval) {
        mindfulnessInterval = setInterval(() => {
            if (mindfulnessTime <= 0) {
                clearInterval(mindfulnessInterval);
                mindfulnessInterval = null;
                alert("Mindfulness session ended!");
            } else {
                mindfulnessTime--;
                updateMindfulnessDisplay();
            }
        }, 1000);
    }
});

resetMindfulnessBtn.addEventListener('click', () => {
    clearInterval(mindfulnessInterval);
    mindfulnessInterval = null;
    mindfulnessTime = 0;
    updateMindfulnessDisplay();
});

function updateMindfulnessDisplay() {
    const minutes = Math.floor(mindfulnessTime / 60);
    const seconds = mindfulnessTime % 60;
    mindfulnessDisplay.innerText = `${pad(minutes)}:${pad(seconds)}`;
}

// Initialize Mindfulness Display
updateMindfulnessDisplay();

// Mood Tracker
document.getElementById('save-mood').addEventListener('click', () => {
    const moodLevel = document.getElementById('mood-level').value;
    if (moodLevel >=1 && moodLevel <=5) {
        document.getElementById('mood-display').innerText = `Your current mood level: ${moodLevel}/5`;
        // Optionally, save to localStorage or a backend
    } else {
        alert("Please select a mood level between 1 and 5.");
    }
});
