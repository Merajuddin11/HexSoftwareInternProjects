const inputBox = document.getElementById("inputBox");
const addBtn = document.getElementById("addBtn");
const todoList = document.getElementById("todoList");

let editTodo = null;

// Add Todo
const addTodo = () => {
  const inputText = inputBox.value.trim();
  if (inputText.length <= 0) {
    alert("You must write something in your to do");
    return;
  }

  if (addBtn.value === "Edit" && editTodo) {
    const oldText = editTodo.target.parentElement.querySelector("p").innerHTML;
    editTodo.target.parentElement.querySelector("p").innerHTML = inputText;

    editLocalTodos(oldText, inputText);

    addBtn.value = "Add";
    inputBox.value = "";
    editTodo = null;
  } else {
    const newTodo = { text: inputText, done: false };
    saveLocalTodo(newTodo);
    renderTodos();

    inputBox.value = "";
  }
};

// Create a single todo element
function createTodoElement(todoObj) {
  const li = document.createElement("li");

  const p = document.createElement("p");
  p.innerHTML = todoObj.text;
  if (todoObj.done) p.classList.add("done");
  li.appendChild(p);

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.innerText = "Edit";
  editBtn.classList.add("btn", "editBtn");
  if (todoObj.done) editBtn.style.display = "none"; // Hide edit if done
  li.appendChild(editBtn);

  // Mark as done button
  const markTaskDone = document.createElement("button");
  markTaskDone.innerText = todoObj.done ? "Undo" : "MarkDone";
  markTaskDone.classList.add("btn", "markTaskDoneBtn");
  li.appendChild(markTaskDone);

  // Delete button
  const deleteBtn = document.createElement("button");
  deleteBtn.innerText = "Remove";
  deleteBtn.classList.add("btn", "deleteBtn");
  li.appendChild(deleteBtn);

  return li;
}

// Handle Edit, Remove, Mark Done
const todoAction = (e) => {
  const target = e.target;
  const li = target.parentElement;
  const todoText = li.querySelector("p").innerHTML;

  if (target.innerText === "Remove") {
    deleteLocalTodos(todoText);
    renderTodos();
  }

  if (target.innerText === "Edit") {
    inputBox.value = todoText;
    inputBox.focus();
    addBtn.value = "Edit";
    editTodo = e;
  }

  if (target.classList.contains("markTaskDoneBtn")) {
    toggleDone(todoText);
  }
};

// Toggle done status and reorder
function toggleDone(todoText) {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let index = todos.findIndex((t) => t.text === todoText);

  if (index !== -1) {
    todos[index].done = !todos[index].done;
    localStorage.setItem("todos", JSON.stringify(todos));
    renderTodos(); // Re-render with sections
  }
}

// Save new task
const saveLocalTodo = (todo) => {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos.push(todo);
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Load and render tasks from localStorage
const getLocalTodos = () => {
  renderTodos();
};

// Re-render UI with Pending & Completed sections
function renderTodos() {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let pending = todos.filter((t) => !t.done);
  let done = todos.filter((t) => t.done);

  todoList.innerHTML = ""; // Clear UI

  // Pending section
  if (pending.length > 0) {
    const pendingTitle = document.createElement("h3");
    pendingTitle.innerText = "Pending Tasks:";
    todoList.appendChild(pendingTitle);

    pending.forEach((todo) => {
      todoList.appendChild(createTodoElement(todo));
    });
  }

  // Completed section
  if (done.length > 0) {
    const doneTitle = document.createElement("h3");
    doneTitle.innerText = "Completed Tasks:";
    todoList.appendChild(doneTitle);

    done.forEach((todo) => {
      todoList.appendChild(createTodoElement(todo));
    });
  }
}

// Delete task
const deleteLocalTodos = (todoText) => {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  todos = todos.filter((t) => t.text !== todoText);
  localStorage.setItem("todos", JSON.stringify(todos));
};

// Edit task
const editLocalTodos = (oldText, newText) => {
  let todos = JSON.parse(localStorage.getItem("todos")) || [];
  let index = todos.findIndex((t) => t.text === oldText);
  if (index !== -1) {
    todos[index].text = newText;
    localStorage.setItem("todos", JSON.stringify(todos));
  }
};

document.addEventListener("DOMContentLoaded", getLocalTodos);
addBtn.addEventListener("click", addTodo);
todoList.addEventListener("click", todoAction);


