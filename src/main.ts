import "toastify-js/src/toastify.css";
import "./index.css";
import { v4 } from "uuid";
import toastify from "toastify-js";
import { TaskInterface } from "./models/task.model";

let tasks: TaskInterface[] = [];
const tasksForm = document.querySelector<HTMLFormElement>("#taskForm");
const tasksList = document.querySelector<HTMLDivElement>("#tasksList");
tasksForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const title = tasksForm["title"] as unknown as HTMLInputElement;
  const description = tasksForm["description"] as unknown as HTMLInputElement;
  const task: TaskInterface = {
    title: title.value,
    description: description.value,
    id: v4(),
  };
  tasks.push(task);
  //   console.log(task);
  tasksForm.reset();
  localStorage.setItem("tasks", JSON.stringify(tasks));
  toastify({
    text: "Task added successfully",
    style: {
      background: "linear-gradient(to right, #00b09b, #96c93d)",
    },
  }).showToast();
  title.focus();
  renderTasks(tasks);
});
document.addEventListener("DOMContentLoaded", () => {
  tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
  renderTasks(tasks);
});
function renderTasks(tasksInside: TaskInterface[]) {
  tasksList!.innerHTML = "";
  tasksInside.forEach((task) => {
    const taskElement = document.createElement("div");
    taskElement.className =
      "bg-zinc-800 mb-2 rounded-lg hover:bg-zinc-700 hover:cursor-pointer p-4";
    const header = document.createElement("header");
    header.className = "flex justify-between";
    const title = document.createElement("span");
    title.innerText = task.title;
    const description = document.createElement("p");
    description.innerText = task.description;
    const container = document.createElement("div");
    container.className = "flex justify-between";
    const btnEdit = document.createElement("button");
    btnEdit.className =
      "bg-transparent hover:bg-zinc-700 text-green-700 hover:text-white py-2 px-4 mr-3 border border-green-700 hover:border-white rounded-lg";
    btnEdit.innerText = "Edit";
    const btnDelete = document.createElement("button");
    btnDelete.innerText = "Delete";
    btnDelete.className =
      "bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded-md";
    btnDelete.addEventListener("click", () => {
      tasks = tasks.filter((t) => t.id !== task.id);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      toastify({
        text: "Task deleted successfully",
      }).showToast();
      renderTasks(tasks);
    });
    btnEdit.addEventListener("click", () => {
      const newTitle = prompt("Enter new title", task.title);
      const newDescription = prompt("Enter new description", task.description);
      if (newTitle && newDescription) {
        task.title = newTitle;
        task.description = newDescription;
        localStorage.setItem("tasks", JSON.stringify(tasks));
        toastify({
          text: "Task updated successfully",
        }).showToast();
        renderTasks(tasks);
      }
    });

    header.append(title);
    container.append(btnEdit);
    container.append(btnDelete);
    header.append(container);

    taskElement.append(header);
    taskElement.append(description);
    tasksList?.append(taskElement);
  });
}
