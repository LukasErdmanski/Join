/**
 * Template for creating a task in the backlog.
 * @param {Array} newTask - The new generated task.
 * @param {number} i - This marks the position of the task in the JSON 'allTasks'.
 * @returns {HTMLElement} The HTML Element of the new task (one line) in the backlog.
 */
function newTaskTemp(newTask, i) {
  return /*html*/ `
  <div class="d-flex position-relative align-items-sm-center border-1 rounded bg-grey mb-2">
    <div 
      style="background-color:${colorsCategory[newTask.category]}"
      title="${newTask.category}"
      class="category-task position-absolute top-0 bottom-0">
    </div>
    <div class="d-flex justify-content-sm-between justify-content-around w-100 align-items-center flex-column flex-sm-row ms-4">
      <div class="d-flex align-items-center flex-column flex-sm-row me-sm-0">
          <div>
            <img
              src="${newTask.userForTask.avatar}"
              class="user-show cursor-pointer m-sm-3 m-2 rounded-circle"
            />
          </div>
          <div class="d-flex  flex-column  align-items-center  align-items-sm-start mb-2  mb-sm-0">
            <p class="m-0">
              ${newTask.userForTask.name}
            </p>
              <a 
                class="m-0" 
                href="mailto:${newTask.userForTask.email}" 
                alt="${newTask.userForTask.email}">
                  ${newTask.userForTask.email}
              </a>          
          </div>
        </div>
        <div class="d-none d-sm-block text-center">
          <h5 class="mb-0 m-2">
            ${newTask.category}
          </h5>
        </div>
        <div class="d-flex justify-content-center justify-content-sm-end align-items-center flex-sm-row flex-column ms-1 ms-sm-0 mb-2 mb-sm-0">
          <div
            class="d-flex justify-content-center align-items-center justify-content-sm-end align-items-sm-start flex-sm-row flex-column me-sm-2 cursor-pointer"
            id="backlogDetails${i}">
            <b class="d-block d-sm-none main-color text-uppercase">
              Description: 
            </b>
            <span class="hiddenScrollbar overflow-auto text-center text-sm-end text-break max-height-100 width-150">
              ${newTask.description}
            </span>
          </div>
        </div>      
      </div>
      <div class="d-flex justify-content-centerpt-sm-0">
        <button
          class="btn-close p-2 m-auto"
          type="button"
          onclick="deleteTask(${i}, generateAllTasks)"
          aria-label="Close">
        </button>
      </div>
  </div>
  `;
}

/**
 * Generates a single task item in the kanban column in the board.
 * @param {JSON} task - The task from allTasks array with a certain filtered category.
 * @returns {HTMLElement} The HTML code for the task item defined with the task paramter
 * for a specific kanban column in the board.
 */
function genHTMLBoardTaskItem(task) {
  return /* html */ `
    <!-- a column task item -->
    <div 
      id="${task.id}" 
      class="card green board-border my-2 cursor-pointer" 
      draggable="true" 
      ondragend="stopSlideJustOnDrop()"
      ondragstart="startDragging(${task["id"]})" 
      data-bs-toggle="modal" 
      data-bs-target="#staticBackdrop"
      onclick="openModal(${task["id"]})">
        <div class="card-header p-1 fs-6">
        <span 
          class="badge p-1 fw-semibold" 
          style="background-color: ${colorsCategory[task["category"]]}">
            ${task["category"]}
        </span>
    </div>
        <div class="card-body text-dark p-1">
            <p class="card-title fw-bold m-0">${task["title"]}</p>
            <p class="card-text d-none">${task["description"]} </p>
        </div>

        <div class="card-footer bg-transparent p-1 d-flex justify-content-between align-items-center gap-1">
            <span class="fw-semibold text-dark">${task["date"]}</span>
            <div class="cardAssignedTo">
                <img 
                  src="${task.userForTask.avatar}" 
                  class="rounded-circle"
                />
            </div>
        </div>
    </div>
    `;
}

/**
 * Creates the buttons for the modal in the board with onclick functions.
 * @param {number} indexTask - The location of the task in alltasks JSON.
 */
function renderButtons(indexTask) {
  document.getElementById("modalBoardBtns").innerHTML = /*html*/ `
  <input 
    title="Delete and close the task." 
    id="modalDeleteBtn"
    class="btn btn-outline-danger p-1 p-sm-2 me-1 me-sm-3" 
    type="button"
    data-bs-dismiss="modal" 
    value="Delete" 
    onclick="deleteTask(${indexTask}, renderAllColumns)" >
  <div>
    <input 
      title="Cancel the changes and close the task." 
      id="modalCancelBtn"
      class="btn btn-outline-secondary p-1 p-sm-2 me-1 me-sm-3" 
      type="button"
      data-bs-dismiss="modal" 
      value="Cancel">
    <input 
      title="Save the changes to the task and close it." 
      id="modalSaveBtn"
      class="btn btn-primary p-1 p-sm-2" 
      type="submit" 
      value="Save" 
      onclick="adaptTask(${indexTask}, renderAllColumns)">
  </div>
  `;
}

/**
 * Creates an avatar for each user on the add task sub page.
 * @param {Object} user - This contains all information about a user.
 * @param {number} i - This marks the position of the user in the array users.
 * @returns {HTMLImageElement} The HTML Element of an user avatar with its attributes.
 */
function generateUsers(user, i) {
  return /*html*/ `
  <img 
    title="${user.name}" 
    id="selected${i}" 
    onclick="selectUser(${i})" 
    class="user-show cursor-pointer border border-white rounded-circle" 
    src="${user.avatar}" 
    alt=""
  />
`;
}

/**
 * Creates an avatar image with a blue frame for viewing in the modal in the board.
 * @param {string} user - This contains all information about a user.
 * @param {number} i - This marks the position of user in the array users.
 * @param {number} id - The id of the task.
 * @returns {HTMLImageElement} The HTML image element of the selected user (its avatar) with a blue border.
 */
function blueBorderImg(user, i, id) {
  return /* html */ `
<img class="assigendToImg rounded-circle border border-4 border-primary m-1" src="${user.avatar}" onclick="changeSelectedUser(${i}, ${id})">
`;
}

/**
 * Creates an avatar image with a white frame for viewing in the modal in the board.
 * @param {string} user - This contains all information about a user.
 * @param {number} i - This marks the position of user in the array users.
 * @param {number} id - The id of the task.
 * @returns {HTMLImageElement} The HTML image element of the selected user (its avatar) with a white border.
 */
function whiteBorderImg(user, i, id) {
  return /* html */ `
  <img class="assigendToImg rounded-circle border border-4 border-white m-1" src="${user.avatar}" onclick="changeSelectedUser(${i}, ${id})">
`;
}