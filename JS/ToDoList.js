const form = document.querySelector("#todo-form");

const todoInput = document.querySelector("#todo");

const todoList = document.querySelector(".list-group");

const firstCardBody = document.querySelectorAll(".card-body")[0];

const secondCardBody = document.querySelectorAll(".card-body")[1];

const filter = document.querySelector("#filter");

const clearButton = document.querySelector("#clear-todos");


eventListeners();

function eventListeners() {
    form.addEventListener("submit", addToDo);
    document.addEventListener("DOMContentLoaded", loadAllTodosToUI);
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    clearButton.addEventListener("click", clearAllTodos);
};


function addToDo(e) {
    const newtodo = todoInput.value.trim();
    if (newtodo === "") {
        showAlert("danger", "Please enter a value!");
    } else {
        addToDoUI(newtodo);
        showAlert("success", "Successfully Added!");
    }
    e.preventDefault();
}

function addToDoUI(newtodo) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex justify-content-between";
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class= 'fas fa-trash'></i>";
    listItem.appendChild(document.createTextNode(newtodo));
    listItem.appendChild(link);
    todoList.appendChild(listItem);
    todoInput.value = "";
    updateStorage();
}

function updateStorage() {
    const listarray = [];
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function(item) {
        listarray.push(item.textContent);
    });

    localStorage.setItem("todos", JSON.stringify(listarray));
}

function loadAllTodosToUI() {
    let todos = getTodosFromStorage();
    todos.forEach(function(todo) {
        addToDoUI(todo);
    });
}

function getTodosFromStorage() {
    let todos;
    if (localStorage.getItem("todos") === null) {
        todos = [];
    } else {
        todos = JSON.parse(localStorage.getItem("todos"));
    }
    return todos;
}

function deleteTodo(e) {
    if (e.target.className === "fas fa-trash") {
        e.target.parentElement.parentElement.remove();
        updateStorage()
        showAlert("success", "Successfully Deleted!");
    }
}

function filterTodos(e) {
    const filterValue = e.target.value.toLowerCase();
    const listItems = document.querySelectorAll(".list-group-item");
    listItems.forEach(function(listItem) {
        const text = listItem.textContent.toLowerCase();
        if (text.indexOf(filterValue) === -1) {
            listItem.setAttribute("style", "display: none !important");
        } else {
            listItem.setAttribute("style", "display: block");
        }
    });
}

function clearAllTodos(e) {
    if (confirm("Are you sure you want to delete all?")) {
        while (todoList.firstElementChild != null) {
            todoList.removeChild(todoList.firstElementChild);
        }
        updateStorage();
    }
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type}`;
    alert.textContent = message;
    firstCardBody.appendChild(alert);
    setTimeout(function() {
        alert.remove();
    }, 2000);
}