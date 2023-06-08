// Import the db object from the correct path
import { db } from "../../index.js";
import { doc, getDoc, setDoc } from 'https://www.gstatic.com/firebasejs/9.0.1/firebase-firestore.js';

// Function to add a task to Firestore
const addTaskToFirestore = async (uid, column, content) => {
  try {
    const docRef = doc(db, "tasks", uid);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      // If the user's document exists, update the column with the new task
      const tasks = docSnapshot.data().tasks || {};
      tasks[column] = tasks[column] || []; // Initialize tasks[column] if it doesn't exist
      tasks[column].push(content);
      await setDoc(docRef, { tasks });

      // Update the task container in the DOM
      const taskContainer = document.getElementById(column).querySelector(".task-container");
      const taskId = `${column}-task-${tasks[column].length - 1}`;
      const taskElement = createTaskElement(taskId, content);
      taskContainer.appendChild(taskElement);

      window.alert("Task added successfully!"); // Display a window alert
      console.log("Task added to Firestore successfully!");
    } else {
      // If the user's document doesn't exist, create a new document and set the initial tasks
      const tasks = {
        [column]: [content], // Create a new array with the first task
      };
      await setDoc(docRef, { tasks });

      // Update the task container in the DOM
      const taskContainer = document.getElementById(column).querySelector(".task-container");
      const taskId = `${column}-task-0`;
      const taskElement = createTaskElement(taskId, content);
      taskContainer.appendChild(taskElement);

      window.alert("Task added successfully!"); // Display a window alert
      console.log("Task added to Firestore successfully!");
    }
  } catch (error) {
    console.error("Error adding task to Firestore:", error);
  }
};

// Replace "USER_UID" with the actual UID of the user
const uid = localStorage.getItem("uid");

// Check if the UID exists in localStorage
if (!uid) {
  console.log("User UID not found in localStorage.");
}

// Get the kanban board columns
const columns = document.querySelectorAll(".column");

// Function to handle task submission
const handleTaskSubmission = (event, column) => {
  event.preventDefault();

  // Get the task input value
  const input = event.target.querySelector("input");
  const content = input.value.trim();

  if (content !== "") {
    // Add the task to Firestore
    addTaskToFirestore(uid, column, content);

    // Reset the input field
    input.value = "";
  }
};

// Add submit event listener to each column's form
columns.forEach((column) => {
  const form = column.querySelector("form");
  form.addEventListener("submit", (event) => {
    handleTaskSubmission(event, column.id);
  });
});

// Function to fetch tasks from Firestore
const fetchTasksFromFirestore = async (uid) => {
  try {
    const docRef = doc(db, "tasks", uid);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const tasks = docSnapshot.data().tasks;

      // Clear all task containers
      const columns = document.querySelectorAll(".column");
      columns.forEach((column) => {
        const taskContainer = column.querySelector(".task-container");
        taskContainer.innerHTML = "";
      });

      // Process the tasks data and update the tables
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

// Fetch tasks when the page loads
fetchTasksFromFirestore(uid);

// Function to create a task element
const createTaskElement = (taskId, content) => {
  const taskElement = document.createElement("div");
  taskElement.classList.add("task");
  taskElement.textContent = content;
  taskElement.setAttribute("draggable", "true"); // Add draggable attribute
  taskElement.setAttribute("id", taskId); // Set unique ID for the task

  // Add event listeners for drag events
  taskElement.addEventListener("dragstart", handleTaskDragStart);
  taskElement.addEventListener("dragend", handleTaskDragEnd);

  return taskElement;
};

// Function to handle task drag start event
const handleTaskDragStart = (event) => {
  const taskId = event.target.id;
  event.dataTransfer.setData("text/plain", taskId);
};

// Function to handle task drag end event
const handleTaskDragEnd = (event) => {
  event.preventDefault();
  // Perform any necessary cleanup or visual changes after dragging ends
};

// Function to handle column drag over event
const handleColumnDragOver = (event) => {
  event.preventDefault();
};

// Function to handle task drop event
const handleTaskDrop = (event, targetColumn) => {
  event.preventDefault();
  const taskId = event.dataTransfer.getData("text/plain");
  const taskElement = document.getElementById(taskId);
  const targetTaskContainer = targetColumn.querySelector(".task-container");

  targetTaskContainer.appendChild(taskElement);

  // Update the task in Firestore with the new column
  const content = taskElement.textContent;
  updateTaskColumnInFirestore(uid, taskId, targetColumn.id, content);
};

// Function to update task column in Firestore
const updateTaskColumnInFirestore = async (uid, taskId, column, content) => {
  try {
    const docRef = doc(db, "tasks", uid);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const tasks = docSnapshot.data().tasks;

      // Remove the task from its previous column
      for (const [col, taskList] of Object.entries(tasks)) {
        const taskIndex = taskList.indexOf(content);
        if (taskIndex !== -1) {
          tasks[col].splice(taskIndex, 1);
          break;
        }
      }

      // Add the task to the target column
      tasks[column] = tasks[column] || [];
      tasks[column].push(content);

      // Update the tasks in Firestore
      await setDoc(docRef, { tasks });

      console.log("Task column updated in Firestore successfully!");
    } else {
      console.log("No tasks found for the user in Firestore.");
    }
  } catch (error) {
    console.error("Error updating task column in Firestore:", error);
  }
};

// Add event listeners to enable drag-and-drop functionality
columns.forEach((column) => {
  column.addEventListener("dragover", handleColumnDragOver);
  column.addEventListener("drop", (event) => {
    handleTaskDrop(event, column);
  });
});
