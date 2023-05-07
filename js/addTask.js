/**
 * The selected user in the add task.
 */
let selectedUser = [];

let formAddTask = document.getElementById('addTaskSubmit');

/**
 * The today's date
 */
let today = new Date();

/**
 * The number of days of today's date.
 * @type {number}
 */
let dd = today.getDate();

/**
 * The number of months of today's date.
 * @type {number}
 */
let mm = today.getMonth() + 1;

/**
 * The year of the today's date.
 * @type {number}
 */
let yyyy = today.getFullYear();

/**
 * Adds a new task by getting the values from document by id.<br>
 * Safes it in the JSON 'newTask'.<br>
 * Clears the input.<br>
 * Shows a message with the value for wich member is the task added.
 */
async function addTask() {
  allTasks = await loadFromBackend('allTasks');
  let date = document.getElementById('txtDate');
  let newTask = {
    title: getInputValue('title'),
    date: date.value,
    category: getInputValue('category'),
    urgency: getInputValue('urgency'),
    description: getInputValue('description'),
    userForTask: selectedUser,
    id: new Date().getTime(),
    state: 'toDo',
  };
  getDate(newTask, date);
  saveTask(newTask);
}

/**
 * Gets the value of the date from the add task formular.
 * @param {JSON} newTask - The JSON array of a new created task.
 * @param {number} date - The due date of the new created task.
 */
function getDate(newTask, date) {
  if ((newTask.date = !date.value)) {
    newTask.date = today;
  } else {
    newTask.date = date.value.replace('.', '/');
  }
}

/**
 * This returns a HTML element with a certain id.
 * @param {string} id - The value of id.
 * @returns {HTMLElement} The id from the HTML element.
 */
function getInputValue(id) {
  return document.getElementById(id).value;
}

/**
 * Saves the new task and push it to the JSON 'allTasks'.
 * @param {JSON} newTask - The JSON array task that will be stored..
 */
async function saveTask(newTask) {
  allTasks.push(newTask);
  await saveInBackend(allTasks, 'allTasks');
}

/**
 * Deletes unsafed values from the inputs if the written or clicked inputs are not really want to add.
 */
function deleteUnsafedInput() {
  formAddTask.reset();
  showAllUser();
}

/**
 * Selects an avatar to choose a user to add a task.<br>
 * Creates a new element which shows only the user who is selected.
 * @param {string} i - The person, who is chosen by clicking an avatar.
 */
function selectUser(i) {
  document.getElementById(`selected${i}`).classList.toggle('user-selected');
  selectedUser = users[i];
  document.getElementById(`user`).innerHTML = /*html*/ ` 
    <div onclick="showAllUserAndDisable()"> 
      <img title="${selectedUser.name}" id="${i}" class="user-show cursor-pointer rounded-circle user-selected" src="${selectedUser.avatar}" alt=""></div>`;
  document.getElementById('createTask').removeAttribute('disabled');
}

/**
 * Shows all users and disables the commit button, when no single user is selected.
 */
function showAllUserAndDisable() {
  showAllUser();
  document.getElementById('createTask').disabled = true;
}

/**
 * Loads the current date and formats it so it can be used as a default value in the add task formular.
 */
function loadCurrentDate() {
  if (/^\d$/.test(dd)) {
    dd = '0' + dd;
  }
  if (/^\d$/.test(mm)) {
    mm = '0' + mm;
  }
  today = dd + '/' + mm + '/' + yyyy;
  document.getElementById('txtDate').value = today;
}

formAddTask.addEventListener('submit', handleFormAddTask);

/**
 * Shows the toast and resets the add task formular.
 * @param {SubmitEvent} event - The returned event, which will be prevented.
 */
function handleFormAddTask(event) {
  const SUCCESS_TOAST = document.getElementById('success_task');
  event.preventDefault();
  const TOAST_ADDTASK = new bootstrap.Toast(SUCCESS_TOAST);
  TOAST_ADDTASK.show();
  formAddTask.reset();
  showAllUser();
  loadCurrentDate();
}
