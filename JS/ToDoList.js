const form = document.getElementById("todo-form");

const todoInput = document.getElementById("todo");

const todoList = document.querySelector(".list-group");

const firstCardBody = document.querySelectorAll(".card-body")[0];

const secondCardBody = document.querySelectorAll(".card-body")[1];

const filter = document.getElementById("filter");

const clearButton = document.getElementById("clear-todos");

const btnMsgGroup = document.getElementById("btn-msg-group");


eventListeners();

function eventListeners() {
    form.addEventListener("submit", addToDo);

    if(document.readyState !== 'loading') {
        loadAllTodosToUI();
    }
    else {
        document.addEventListener('DOMContentLoaded',loadAllTodosToUI)
    }
    
    secondCardBody.addEventListener("click", deleteTodo);
    filter.addEventListener("keyup", filterTodos);
    todoList.addEventListener("click",toggleStatus);
    clearButton.addEventListener("click", clearAllTodos);
    
};


function addToDo(e) {
    const toDoValue = todoInput.value.trim();
    const newtodo = {value: toDoValue, isItDone:false};
    if (toDoValue === "") {
        showAlert("danger", "Please type a to-do!");
    } else {
        addToDoUI(newtodo);
        showAlert("success", "Successfully Added!");
    }
    e.preventDefault();
}

function addToDoUI(newtodo) {
    const listItem = document.createElement("li");
    listItem.className = "list-group-item d-flex align-items-center justify-content-between";
    const div = document.createElement("div");
    const link = document.createElement("a");
    link.href = "#";
    link.className = "delete-item";
    link.innerHTML = "<i class= 'fas fa-trash'></i>";
    div.appendChild(document.createTextNode(newtodo.value));
    if(newtodo.isItDone){
        listItem.className += " list-group-item-success";
        const checkIcon = document.createElement("i");
        checkIcon.className = "fas fa-check fa-lg ml-2";
        div.appendChild(checkIcon);
    }
    listItem.appendChild(div);
    listItem.appendChild(link);
    todoList.appendChild(listItem);
    todoInput.value = "";
    updateStorage();
}

function updateStorage() {
    const listarray = [];
    const listItems = document.querySelectorAll(".list-group-item");

    listItems.forEach(function(item) {
        if(item.classList.contains("list-group-item-success")){
            listarray.push({value: item.textContent, isItDone:true});
        }
        else{
            listarray.push({value: item.textContent, isItDone:false});
        }       
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

function toggleStatus(e){
    if(e.target.classList.contains("list-group-item")){
        if(e.target.classList.contains("list-group-item-success")){
            e.target.className = "list-group-item d-flex align-items-center justify-content-between";
            e.target.firstElementChild.lastElementChild.remove();
        }
        else{
            e.target.className += " list-group-item-success";
            const checkIcon = document.createElement("i");
            checkIcon.className = "fas fa-check fa-lg ml-2";
            e.target.firstElementChild.appendChild(checkIcon);
        }
        updateStorage();
    }   
}

function showAlert(type, message) {
    const alert = document.createElement("div");
    alert.className = `alert alert-${type} ml-3 mb-0 p-1`;
    alert.style.width="max-content";
    alert.textContent = message;
    btnMsgGroup.appendChild(alert);
    setTimeout(function() {
        alert.remove();
    }, 2000);
}