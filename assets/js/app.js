
const todoForm = document.getElementById("todoForm");
const spinner = document.getElementById("spinner");
const updateTodoBtn = document.getElementById("updateTodoBtn");
const addTodoBtn = document.getElementById("addTodoBtn");
const todoInput = document.getElementById("todoInput");
const todoContainer = document.getElementById("todoContainer");

const baseTodoUrl = `https://posts-crud-c2796-default-rtdb.firebaseio.com`;


function snackBar(msg, icon) {
    Swal.fire({
        text: msg,
        icon: icon,
        timer: 3000
    })
}

let State = {
    todoArray: [],
    editId: null
}

function spinnershow() {
    spinner.classList.remove("d-none")
}

function spinnerhide() {
    spinner.classList.add("d-none")
}





function fetchTodoData() {
    let todoUrl = `${baseTodoUrl}/todo.json`;
    
    spinnershow()

    fetch(todoUrl, {
        body: null,
        headers: {
            "Content-type": "application/json",
            "security": "JWT token",
        },
        method: "GET"
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            for (let key in data) {
                data[key].id = key;
                State.todoArray.unshift(data[key]);
            }

            createTodos(State.todoArray);
        })
        .catch(err => {
            snackBar( "error");
        })
        .finally(() => {
            
            spinnerhide()
        })
}

function createTodos(arr) {
   
    let res = "";
    arr.forEach(todo => {
        res += `
            <li class="list-group-item d-flex justify-content-between" id="${todo.id}">
                <strong>${todo.todoItem}</strong>
                <div>
                    <button onclick="onEdit(this)" class="btn btn-sm btn-outline-info mr-2">Edit</button>
                    <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">Remove</button>
                </div>
            </li>
        `
    });
    todoContainer.innerHTML = res;
}

fetchTodoData();




function onTodoCreate(eve) {

    let TODO_URL = `${baseTodoUrl}/todo.json`;

    eve.preventDefault()

    let todoObj = {
        todoItem: todoInput.value
    }

    spinnershow()

    fetch(TODO_URL, {
        method: "POST",
        body: JSON.stringify(todoObj),
        headers: {
            "Content-type": "application/json",
            "security": "JWT token",
        }
    })
        .then(res => {
            return res.json();
        })
        .then(data => {
            todoObj.id = data.name;
            State.todoArray.unshift(todoObj);
            todoForm.reset();
            


            let Li = document.createElement("li")

            Li.id = todoObj.id

            Li.className = "list-group-item d-flex justify-content-between"
            Li.innerHTML = `
            <strong>${todoObj.todoItem}</strong>
            <div>
                <button onclick="onEdit(this)" class="btn btn-sm btn-outline-info mr-2">Edit</button>
                <button onclick="onDelete(this)" class="btn btn-sm btn-outline-danger">Remove</button>
            </div>
        `;
            todoContainer.prepend(Li);
            snackBar( "success");
        })
        .catch(err => {
            snackBar( err);
        })
        .finally(() => {
            
            spinnerhide()
        })
}


function onEdit(ele) {

    let editId = ele.closest("li").id

    State.editId = editId

    let editObj = State.todoArray.find(todo => todo.id === editId)

    todoInput.value = editObj.todoItem


    addTodoBtn.classList.add("d-none")
    updateTodoBtn.classList.remove("d-none")
}

function onTodoUpdate() {

    let UPDATE_ID = State.editId

    let UPDATE_URL = `${baseTodoUrl}/todo/${UPDATE_ID}.json`

    let udpatedObj = {
        todoItem: todoInput.value
    }
    
    spinnershow()

    fetch(UPDATE_URL, {
        method: "PATCH",
        body: JSON.stringify(udpatedObj),
        headers: {
            "Content-type": "application/json",
            "security": "JWT token",
        }
    })
        .then(res => {
            return res.json()
        })
        .then(data => {
            udpatedObj.id = UPDATE_ID
            const udpdateIndex = State.todoArray.findIndex(todo => todo.id === UPDATE_ID)

            State.todoArray[udpdateIndex] = udpatedObj

            let udpateLi = document.getElementById(UPDATE_ID)

            udpateLi.querySelector("strong").innerText = udpatedObj.todoItem
            todoForm.reset();

      

            addTodoBtn.classList.remove("d-none")
            updateTodoBtn.classList.add("d-none")
            snackBar(`Todo with id : ${UPDATE_ID} is updated successfully!!!`, "success")
        })

        .catch(err => {
            snackBar( "error")
        })
        .finally(() => {
            
            spinnerhide()

        })
}



function onDelete(ele) {
    let DELETE_ID = ele.closest("li").id

    let DELETE_URL = `${baseTodoUrl}/todo/${DELETE_ID}.json`
    Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
    }).then((result) => {
        if (result.isConfirmed) {
            
            spinnershow()

            fetch(DELETE_URL, {
                method: "Delete",
                body: null,
                headers: {
                    "Content-type": "application/json",
                    "security": "JWT TOKEN"
                }
            })
                .then(res => {
                    return res.json()

                })
                .then(data => {
                    const deleteIndex = State.todoArray.findIndex(todo => todo.id === DELETE_ID)

                    State.todoArray.splice(deleteIndex, 1)

                    ele.closest("li").remove()
                    Swal.fire({
                        title: "Deleted!",
                        text: "Your todo has been deleted.",
                        icon: "success"
                    });
                })
                .catch(err => {
                    snackBar(`Todo with id ${DELETE_ID} is removed successfully!!!`)
                })
                .finally(() => {
                
                    spinnerhide()

                })

        }
    });
}


todoForm.addEventListener("submit", onTodoCreate);
updateTodoBtn.addEventListener("click", onTodoUpdate)

