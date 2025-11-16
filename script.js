const input = document.getElementById("task-input");
const addBtn = document.getElementById("add-btn");
const clearAllBtn = document.getElementById("clear-all");
const taskList = document.getElementById("task-list");
const filter = document.getElementById("filter");
const themeToggle = document.getElementById("theme-toggle");
const taskCounter = document.getElementById("task-counter");

/* Load saved tasks + theme */
window.onload = function () {
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    savedTasks.forEach(task => createTask(task.text, task.completed));

    if (localStorage.getItem("theme") === "dark")
        document.body.classList.add("dark");

    updateCounter();
    updateThemeIcon();
};

addBtn.onclick = addTask;
clearAllBtn.onclick = clearAll;
filter.onchange = filterTasks;
themeToggle.onclick = toggleTheme;

input.addEventListener("keypress", e => {
    if (e.key === "Enter") addTask();
});

function addTask() {
    const text = input.value.trim();
    if (!text) return;
    createTask(text, false);
    input.value = "";
    saveTasks();
    updateCounter();
}

function createTask(text, completed) {
    const li = document.createElement("li");
    li.textContent = text;
    if (completed) li.classList.add("completed");

    const btnBox = document.createElement("div");
    btnBox.className = "btns";

    // Edit button
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️";
    editBtn.className = "edit-btn";
    editBtn.onclick = () => editTask(li);

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "✖";
    delBtn.className = "delete-btn";
    delBtn.onclick = () => {
        li.remove();
        saveTasks();
        updateCounter();
    };

    btnBox.appendChild(editBtn);
    btnBox.appendChild(delBtn);
    li.appendChild(btnBox);

    li.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") return;
        li.classList.toggle("completed");
        saveTasks();
        updateCounter();
    });

    taskList.appendChild(li);
    filterTasks();
}

function editTask(li) {
    const newText = prompt("Edit task:", li.firstChild.textContent);
    if (newText !== null && newText.trim() !== "") {
        li.firstChild.textContent = newText.trim();
        saveTasks();
    }
}

function clearAll() {
    if (confirm("Delete all tasks?")) {
        taskList.innerHTML = "";
        saveTasks();
        updateCounter();
    }
}

function saveTasks() {
    const tasks = [...taskList.children].map(li => ({
        text: li.firstChild.textContent,
        completed: li.classList.contains("completed")
    }));
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function filterTasks() {
    const value = filter.value;
    [...taskList.children].forEach(li => {
        const done = li.classList.contains("completed");
        li.style.display =
            value === "all" ||
                (value === "completed" && done) ||
                (value === "pending" && !done)
                ? "flex"
                : "none";
    });
}

function updateCounter() {
    const tasks = [...taskList.children];
    const completed = tasks.filter(li => li.classList.contains("completed")).length;
    const pending = tasks.length - completed;
    taskCounter.textContent = `Pending: ${pending} | Completed: ${completed}`;
}

function toggleTheme() {
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    updateThemeIcon();
}

function updateThemeIcon() {
    themeToggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}