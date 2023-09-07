// Function to fetch tasks from the API and render them
async function fetchAndRenderTasks() {
  try {
    const response = await fetch("/tasks");
    if (!response.ok) {
      throw new Error("Failed to fetch tasks");
    }
    const tasks = await response.json();
    const taskList = document.getElementById("task-list");
    taskList.innerHTML = "";

    if (tasks.length === 0) {
      // If there are no tasks, display a message
      const noTasksMessage = document.createElement("p");
      noTasksMessage.textContent = "No tasks for today!!!";
      taskList.appendChild(noTasksMessage);
    } else {
      // If there are tasks, display them
      tasks.forEach((task) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `
                    <input type="checkbox" ${task.completed ? "checked" : ""}>
                    <span>${task.title}</span>
                `;
        taskList.appendChild(listItem);

        // Add an event listener to the checkbox to mark the task as done and delete it
        const checkbox = listItem.querySelector('input[type="checkbox"]');
        checkbox.addEventListener("change", async () => {
          if (checkbox.checked) {
            // If the checkbox is checked, mark the task as done and delete it
            try {
              const response = await fetch(`/tasks/${task._id}`, {
                method: "DELETE",
              });

              if (!response.ok) {
                throw new Error("Failed to delete task");
              }

              await fetchAndRenderTasks();
            } catch (error) {
              console.error(error);
            }
          }
        });
      });
    }
  } catch (error) {
    console.error(error);
  }
}

// Function to add a new task
async function addTask() {
  const newTaskTitle = prompt("Enter a new task:");
  if (newTaskTitle) {
    try {
      const response = await fetch("/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: newTaskTitle, completed: false }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      await fetchAndRenderTasks();
    } catch (error) {
      console.error(error);
    }
  }
}

// Event listener for the "Add Task" button
const addTaskButton = document.getElementById("add-task-button");
addTaskButton.addEventListener("click", addTask);

// Initial rendering of tasks
fetchAndRenderTasks();
