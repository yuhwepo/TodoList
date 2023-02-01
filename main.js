const taskInput = document.querySelector(".input");
const filters = document.querySelectorAll(".filter-todo li");
const taskList = document.getElementById("task-list");
const addButton = document.querySelector(".btn--add");
const editButton = document.querySelector(".btn--edit");

let editId;
let isEditTask = false;
let todos = JSON.parse(localStorage.getItem("todo-list")); // getting localstorage todo-list

filters.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector("li.active").classList.remove("active");
    btn.classList.add("active");
    showTodo(btn.id);
  });
});

// EVENT LISTENER

taskInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    if (!isEditTask) {
      addButton.click();
    } else {
      editButton.click();
    }
  }
});

addButton.addEventListener("click", addTask);

editButton.addEventListener("click", () => {
  addTask();
  showSuccessToast();
  editButton.style.display = "none";
  addButton.style.display = "block";
});

// FUNCTION

function showTodo(filter) {
  let li = "";
  if (todos) {
    todos.forEach((todo, id) => {
      // if todo status is doned, set isDoned value to checked
      let isDoned = todo.status == "doned" ? "checked" : "";
      if (filter == todo.status || filter == "all") {
        li += `<li class="task-box">
                <label for="${id}">
                  <input type="checkbox" id="${id}" ${isDoned} style="display: none" onclick="updateStatus(this, '${filter}')"/>
                  <p class="task-text ${isDoned}">${todo.name}</p>
                </label>
                <div class="task-item">
                  <button class="task-icon--red task-icon">
                    <i class="fa-solid fa-trash-can" onclick="deleteTask(${id}, '${filter}')"></i>
                  </button>
                  <button class="task-ion--green task-icon">
                    <i class="fa-solid fa-pen-to-square" onclick="editTask(${id}, '${todo.name}')"></i>
                  </button>
                </div>
              </li>`;
      }
    });
  }
  taskList.innerHTML = li;
}

showTodo("all");

function addTask() {
  let userTask = taskInput.value.trim();

  if (userTask) {
    if (!isEditTask) {
      // if todos isn't exist, pass an empty array totos
      todos = !todos ? [] : todos;
      let taskInfo = { name: userTask, status: "undone" };
      // adding new task to todos
      todos.push(taskInfo);
    } else {
      isEditTask = false;
      todos[editId].name = userTask;
    }
    taskInput.value = "";
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodo(document.querySelector("li.active").id);
  } else {
    showErrorToast();
  }
}

function deleteTask(deleteId, filter) {
  isEditTask = false;
  //removing selected task from array/todos
  todos.splice(deleteId, 1);
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}

function editTask(taskId, taskName) {
  editId = taskId;
  isEditTask = true;
  taskInput.value = taskName;
  taskInput.focus();
  addButton.style.display = "none";
  editButton.style.display = "block";
}

function updateStatus(selectedTask, filter) {
  // getting paragraph thay contains task name
  let taskName = selectedTask.parentElement.lastElementChild;
  if (selectedTask.checked) {
    taskName.classList.add("checked");
    //updating the status of selected task to doned
    todos[selectedTask.id].status = "doned";
  } else {
    taskName.classList.remove("checked");
    //updating the status of selected task to undone
    todos[selectedTask.id].status = "undone";
  }
  localStorage.setItem("todo-list", JSON.stringify(todos));
  showTodo(filter);
}

// Toast

function toast({ title = "", message = "", type = "info", duration = 3000 }) {
  const main = document.getElementById("toast");
  if (main) {
    const toast = document.createElement("div");

    // Auto remove toast
    const autoRemoveId = setTimeout(function () {
      main.removeChild(toast);
    }, duration + 1000);

    // Remove toast when clicked
    toast.onclick = function (e) {
      if (e.target.closest(".toast__close")) {
        main.removeChild(toast);
        clearTimeout(autoRemoveId);
      }
    };

    const icons = {
      success: "fa-solid fa-check-circle",
      info: "fa-solid fa-info-circle",
      warning: "fa-solid fa-exclamation-circle",
      error: "fa-solid fa-exclamation-circle",
    };
    const icon = icons[type];

    const delay = (duration / 1000).toFixed(2);

    toast.classList.add("toast", `toast--${type}`);
    toast.style.animation = `slideInLeft linear 0.3s, fadeOut linear 1s ${delay}s forwards`;
    toast.innerHTML = `
    <div class="toast__icon">
      <i class="${icon}"></i>
    </div>
    <div class="toast__body">
      <h3 class="toast__title">${title}</h3>
      <p class="toast__msg">${message}</p>
    </div>
    <div class="toast__close">
      <i class="fa-solid fa-xmark"></i>
    </div>
    `;
    main.appendChild(toast);
  }
}

function showSuccessToast() {
  toast({
    title: "Thành công!",
    message: "Chỉnh sửa thành công",
    type: "success",
    duration: 3000,
  });
}

function showErrorToast() {
  toast({
    title: "Thất bại!",
    message: "Vui lòng nhập, hộp thoại không được để trống",
    type: "error",
    duration: 3000,
  });
}

// End Toast
