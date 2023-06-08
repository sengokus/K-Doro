// Import the db object from the correct path
import { db } from "../../index.js";
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';

// function to add a task to Firestore
const addTaskToFirestore = async (uid, column, content) => {
    try {
        const docRef = doc(db, "tasks", uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            // if the user's document exists, update the column with the new task
            const tasks = docSnapshot.data().tasks || {};
            tasks[column] = tasks[column] || []; // initialize tasks[column] if it doesn't exist
            tasks[column].push(content);
            await setDoc(docRef, { tasks });

            // update the task container in the DOM
            const taskContainer = document.getElementById(column).querySelector(".task-container");
            const taskId = `${column}-task-${tasks[column].length - 1}`;
            const taskElement = createTaskElement(taskId, content);
            taskContainer.appendChild(taskElement);

            window.alert("Task added successfully!");
            console.log("Task added to Firestore successfully!");
        } else {
            // if the user's document doesn't exist, create a new document and set the initial tasks
            const tasks = {
                [column]: [content], // create a new array with the first task
            };
            await setDoc(docRef, { tasks });

            // update the task container in the DOM
            const taskContainer = document.getElementById(column).querySelector(".task-container");
            const taskId = `${column}-task-0`;
            const taskElement = createTaskElement(taskId, content);
            taskContainer.appendChild(taskElement);

            window.alert("Task added successfully!");
            console.log("Task added to Firestore successfully!");
        }
    } catch (error) {
        console.error("Error adding task to Firestore:", error);
    }
};

// replace "USER_UID" with the actual UID of the user
const uid = localStorage.getItem("uid");

// check if the UID exists in localStorage
if (!uid) {
    console.log("User UID not found in localStorage.");
}

// get the kanban board columns
const columns = document.querySelectorAll(".column");

// function to handle task submission
const handleTaskSubmission = (event, column) => {
    event.preventDefault();

    // get the task input value
    const input = event.target.querySelector("input");
    const content = input.value.trim();

    if (content !== "") {
        // add the task to Firestore
        addTaskToFirestore(uid, column, content);

        // reset the input field
        input.value = "";
    }
};

// add submit event listener to each column's form
columns.forEach((column) => {
    const form = column.querySelector("form");
    form.addEventListener("submit", (event) => {
        handleTaskSubmission(event, column.id);
    });
});

// function to fetch tasks from Firestore
const fetchTasksFromFirestore = async (uid) => {
    try {
        const docRef = doc(db, "tasks", uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const tasks = docSnapshot.data().tasks;

            // clear all task containers
            const columns = document.querySelectorAll(".column");
            columns.forEach((column) => {
                const taskContainer = column.querySelector(".task-container");
                taskContainer.innerHTML = "";
            });

            // process the tasks data and update the tables
            for (const [columnId, taskList] of Object.entries(tasks)) {
                const column = document.getElementById(columnId);
                if (column) {
                    const taskContainer = column.querySelector(".task-container");
                    taskList.forEach((task, index) => {
                        const taskId = `${columnId}-task-${index}`; // Create a unique ID for each task
                        const taskElement = createTaskElement(taskId, task);
                        taskContainer.appendChild(taskElement);
                    });
                }
            }
            console.log("Tasks fetched from Firestore successfully!");
        } else {
            console.log("No tasks found for the user in Firestore.");
        }
    } catch (error) {
        console.error("Error fetching tasks from Firestore:", error);
    }
};

// fetch tasks when the page loads
fetchTasksFromFirestore(uid);

// function to create a task element
const createTaskElement = (taskId, content) => {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.textContent = content;
    taskElement.setAttribute("draggable", "true"); // add draggable attribute
    taskElement.setAttribute("id", taskId); // set unique ID for the task

    // add event listeners for drag events
    taskElement.addEventListener("dragstart", handleTaskDragStart);
    taskElement.addEventListener("dragend", handleTaskDragEnd);

    // add event listener for task click event
    taskElement.addEventListener("click", () => {
        openEditModal(taskId, content);
    });
    return taskElement;
};


// open the edit modal
const openEditModal = (taskId, content) => {
    // get the modal element
    const modal = document.getElementById("editModal");

    // get the task input field in the modal
    const input = modal.querySelector("#editTaskInput");

    // set the task content as the input field value
    input.value = content;

    // save the original content and task ID as data attributes on the modal
    modal.dataset.taskId = taskId;
    modal.dataset.originalContent = content;
    const originalContent = modal.dataset.originalContent;

    modal.classList.add("show");

    // add event listener to the modal form for submitting the edited task
    const editTask = modal.querySelector("form");
    editTask.addEventListener("submit", handleEditTaskSubmission);

    // add event listener to the delete task button
    const deleteButton = modal.querySelector("#deleteTaskButton");
    deleteButton.addEventListener("click", () => {
        deleteTask(uid, taskId, originalContent);
        modal.classList.remove("show");
    });

    // add event listener to the cancel button
    const cancelButton = modal.querySelector("#cancelButton");
    cancelButton.addEventListener("click", () => {
        modal.classList.remove("show");
    });
};

const deleteTask = async (uid, taskId, originalContent) => {
    try {
        const docRef = doc(db, "tasks", uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const tasks = docSnapshot.data().tasks;

            // find the task in the tasks object and remove it
            for (const [column, taskList] of Object.entries(tasks)) {
                const taskIndex = taskList.indexOf(originalContent);
                if (taskIndex !== -1) {
                    tasks[column].splice(taskIndex, 1);
                    break;
                }
            }

            // remove the task element from the DOM
            const taskElement = document.getElementById(taskId);
            if (taskElement) {
                taskElement.remove();
            }

            // update the tasks in Firestore
            await setDoc(docRef, { tasks });

            console.log("Task deleted from Firestore successfully!");
            alert("Task deleted successfully!")
        } else {
            console.log("No tasks found for the user in Firestore.");
        }
    } catch (error) {
        console.error("Error deleting task from Firestore:", error);
    }
};

// function to handle the edit task submission
const handleEditTaskSubmission = (event) => {
    event.preventDefault();

    // get the modal element
    const modal = document.getElementById("editModal");

    // get the task input field in the modal
    const input = modal.querySelector("#editTaskInput");

    // get the task ID and original content from the modal data attributes
    const taskId = modal.dataset.taskId;
    const originalContent = modal.dataset.originalContent;

    // get the updated task content from the input field
    const updatedContent = input.value.trim();

    if (updatedContent !== "") {
        // update the task content in the UI
        const taskElement = document.getElementById(taskId);
        taskElement.textContent = updatedContent;

        // update the task content in Firestore
        updateTaskContentInFirestore(uid, taskId, updatedContent, originalContent);
        modal.classList.remove("show");
    }
};

// function to update task content in Firestore
const updateTaskContentInFirestore = async (uid, taskId, updatedContent, originalContent) => {
    try {
        const docRef = doc(db, "tasks", uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const tasks = docSnapshot.data().tasks;

            // find the task in the tasks object and update its content
            for (const [column, taskList] of Object.entries(tasks)) {
                const taskIndex = taskList.indexOf(originalContent);
                if (taskIndex !== -1) {
                    tasks[column][taskIndex] = updatedContent;
                    break;
                }
            }

            // update the tasks in Firestore
            await setDoc(docRef, { tasks });

            console.log("Task content updated in Firestore successfully!");
            alert("Task content updated in Firestore successfully!");
        } else {
            console.log("No tasks found for the user in Firestore.");
        }
    } catch (error) {
        console.error("Error updating task content in Firestore:", error);
    }
};

// function to handle task drag start event
const handleTaskDragStart = (event) => {
    const taskId = event.target.id;
    event.dataTransfer.setData("text/plain", taskId);
};

// function to handle task drag end event
const handleTaskDragEnd = (event) => {
    event.preventDefault();
};

// function to handle column drag over event
const handleColumnDragOver = (event) => {
    event.preventDefault();
};

// function to handle task drop event
const handleTaskDrop = (event, targetColumn) => {
    event.preventDefault();
    const taskId = event.dataTransfer.getData("text/plain");
    const taskElement = document.getElementById(taskId);
    const targetTaskContainer = targetColumn.querySelector(".task-container");

    targetTaskContainer.appendChild(taskElement);

    // update the task in Firestore with the new column
    const content = taskElement.textContent;
    updateTaskColumnInFirestore(uid, taskId, targetColumn.id, content);
};

// function to update task column in Firestore
const updateTaskColumnInFirestore = async (uid, taskId, column, content) => {
    try {
        const docRef = doc(db, "tasks", uid);
        const docSnapshot = await getDoc(docRef);

        if (docSnapshot.exists()) {
            const tasks = docSnapshot.data().tasks;

            // remove the task from its previous column
            for (const [col, taskList] of Object.entries(tasks)) {
                const taskIndex = taskList.indexOf(content);
                if (taskIndex !== -1) {
                    tasks[col].splice(taskIndex, 1);
                    break;
                }
            }
            // add the task to the target column
            tasks[column] = tasks[column] || [];
            tasks[column].push(content);

            // update the tasks in Firestore
            await setDoc(docRef, { tasks });
            console.log("Task column updated in Firestore successfully!");
        } else {
            console.log("No tasks found for the user in Firestore.");
        }
    } catch (error) {
        console.error("Error updating task column in Firestore:", error);
    }
};

// add event listeners to enable drag-and-drop functionality
columns.forEach((column) => {
    column.addEventListener("dragover", handleColumnDragOver);
    column.addEventListener("drop", (event) => {
        handleTaskDrop(event, column);
    });
});