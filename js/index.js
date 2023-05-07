/**
 * The current dragged element (a task item of a board kanban columns).
 * @type {number}
 * @default undefined
 */
let currentDraggedElement;

/**
 * The function is executed immediattasky after loading the web page.
 */
async function initBoard() {
  users = await loadFromBackend("users");
  allTasks = await loadFromBackend("allTasks");
  renderAllColumns();
  modalShowAllUser();
  isThereScrollBar();
}

/**
 * Renders all kanban columns (TO DO, IN PROGRESS etc.) in the board.
 */
function renderAllColumns() {
  renderColumn("toDo");
  renderColumn("inProgress");
  renderColumn("testing");
  renderColumn("done");
}

/**
 * Renders a single specific Kanban column in the board.
 * @param {string} columnName - The value of the state property in 'allTask' JSON.
 * The tasks are filtered accordingly to this from 'allTasks' JSON. /
 * This is also the id of the kanban column in the board, where the filtered task are placed as a task HTML-taskement.
 */
function renderColumn(columnName) {
  let filteredWithSameState = allTasks.filter((a) => a["state"] == columnName);
  document.getElementById(`${columnName}Column`).innerHTML = "";
  for (let index = 0; index < filteredWithSameState.length; index++) {
    const TASK = filteredWithSameState[index];
    document.getElementById(`${columnName}Column`).innerHTML +=
      genHTMLBoardTaskItem(TASK);
    urgencyBoard(TASK.urgency, TASK.id);
  }
}

/**
 * Sets the current dragged task item.
 * @param {number} id - The unique id of the task item.
 */
function startDragging(id) {
  currentDraggedElement = id;
}

/**
 * Executes after a dragged element (here task item) is dropped
 * on the affected container (here board kanban column).
 * Changes the state (to do / in progress / testing / done) for the affected task item.
 * @param {string} state - The name of the board kanban column and the completion process of the affected task item.
 */
async function moveTo(state) {
  let taskIndex = allTasks.find((n) => n.id == currentDraggedElement);
  taskIndex.state = state;
  await saveInBackend(allTasks, "allTasks");
  renderAllColumns();
}

/**
 * A w3school function: Just integrated here.
 * Changes the default behavior of the affected container (here board kanban column)
 * and gives the permission to drop another HTML element over the affected container.
 * @param {DragEvent} ev - Then event, if the a dragged element (her task item) is over (hovering) the affected container (here board kanban column).
 */
function allowDrop(ev) {
  ev.preventDefault();
}

/**
 * Highlights the kanban column when you hover over it with the dragged task item
 * (a corresponding class for this effect will be added to the affected column.).
 * @param {string} columnName - The name of the board kanban column, which should be highlighted
 */
function hightlight(columnName) {
  document.getElementById(columnName).classList.add("drag-area-highlight");
}

/**
 * Removes the highlight effect for the kanban column when the dragged task item stop to hover it or will be dropped on it <br>
 * (a corresponding class for this effect will be removed from the affected colum).
 * @param {string} columnName - The name of the board kanban column, for which the highlicht effect should be removed.
 */
function removeHightlight(columnName) {
  document.getElementById(columnName).classList.remove("drag-area-highlight");
}

/**
 * The initial properties for the above instance of bootstrap carousel as a JSON.
 */
const MY_CAROUSEL_OPTIONS = {
  interval: 550, // The amount of time to delay between automatically cycling an item = The speed of carousel sliding.
  pause: false, // If set to "hover", pauses the cycling of the carousel on mouseenter and resumes the cycling of the carousel on mouseleave. If set to false, hovering over the carousel won’t pause it. On touch-enabled devices, when set to "hover", cycling will pause on touchend (once the user finished interacting with the carousel) for two intervals, before automatically resuming. This is in addition to the mouse behavior.
  wrap: true, // Whether the carousel should cycle continuously or have hard stops.
};

/**
 * The instance of bootstrap carousel object with its initial properties.
 */
const MY_CAROUSEL = new bootstrap.Carousel(
  document.getElementById("carousel"),
  MY_CAROUSEL_OPTIONS
);

/**
 * Adds the highlight effect to the carousel controll button.
 * @param {string} side - The one of the carousel controll buttons
 * (left for the reverse sliding (direction from right to left) /
 * right for the default bootstrap sliding (direction from left to right)).
 */
/**
 *
 */
function highlightCarouselControl(side) {
  document
    .getElementById(side + "-slide-button")
    .classList.add("highlight-carousel-control");
}

/**
 * Removes the highlight effect from the carousel controll button.
 * @param {string} side - The one of the carousel controll buttons
 * (left for the reverse sliding (direction from right to left) /
 * right for the default bootstrap sliding (direction from left to right)).
 */
function removeHighlightCarouselControl(side) {
  document
    .getElementById(side + "-slide-button")
    .classList.remove("highlight-carousel-control");
}

/**
 * The intervall saved after the click on one of the carousel controll buttons.
 * @type {?number}
 * @default null
 */
let timeOut = null;

/**
 * Highlights the carousel controll button on click for the 600 miliseconds.
 * @param {string} side - The one of the carousel controll buttons
 * (left for the reverse sliding (direction from right to left) /
 * right for the default bootstrap sliding (direction from left to right)).
 */
function highlightCarouselControlOnClick(side) {
  clearTimeout(timeOut);
  highlightCarouselControl(side);
  timeOut = setTimeout(() => {
    removeHighlightCarouselControl(side);
  }, 600);
}

/**
 * Starts cycling of the carousel (direction: from left to right).
 */
function startSlideNext() {
  if (window.innerWidth < 576) {
    MY_CAROUSEL.cycle();
  }
}

/**
 * Stops cycling of the carousel (direction: from left to right).
 */
function stopSlideNext() {
  if (window.innerWidth < 576) {
    MY_CAROUSEL.pause();
  }
}

/**
 * Starts reverse cycling of the carousel (direction: from right to left).
 */
function startSlidePrev() {
  if (window.innerWidth < 576) {
    MY_CAROUSEL.cycle();
  }
}

/**
 * Stops reverse sliding of the carousel (direction: from right to left).
 */
function stopSlidePrev() {
  MY_CAROUSEL.pause();
}

/**
 * Stops sliding of the carousel, remove the 'change direction' css class (if the carousel was currently reverse sliding)
 * and the highlight css class of the carousel control buttons.
 */
function stopSlideJustOnDrop() {
  MY_CAROUSEL.pause();
  if (reversed) {
    removedChangeDirectionClassReverseBackChildren();
  }
  removeHighlightCarouselControl("right");
  removeHighlightCarouselControl("left");
}

/**
 * Memory for the state, if the carousel items (kanban columns) and slide indicators have been already reversed in the DOM.
 */
let reversed = false;

/**
 * Adds the class 'change direction' changing the directon of the bootstrap default function cycling to from right to left.
 */
function addChangeDirectionClassReverseChildren() {
  document.getElementById("carousel-inner").classList.add("changeDirection");
  reverseChildren();
  reversed = true;
}

/**
 * Removes the css class 'change direction' changing the directon of the bootstrap default function cycling to from right to left.
 */
function removedChangeDirectionClassReverseBackChildren() {
  document.getElementById("carousel-inner").classList.remove("changeDirection");
  reverseChildren();
  reversed = false;
  correctActiveIndicator();
}

/**
 * Corrects the false active slide indicator to the right one
 * (after execution of carousel reverse sliding with help of default bootstrap fuctions
 * and prevous reversing the order of the carousel items (kanban columns) and slide indicatos in the DOM).
 */
function correctActiveIndicator() {
  let foundedIndex;
  /* Find the false active slide indicator */
  for (let i = 0; i < 4; i++) {
    let value = document.getElementById(`ind${i}`).className;
    if (value == "active") {
      foundedIndex = i;
    }
  }
  /* Removes the css class 'active' and the value 'true'of the bootstrap aria-current attribute of the false slide indicator and add them to the right one. */
  let wrongInd = document.getElementById(`ind${foundedIndex}`);
  wrongInd.classList.remove("active");
  wrongInd.removeAttribute("aria-current");
  let rightInd = document.getElementById(`ind${MY_CAROUSEL._activeElement.id}`);
  rightInd.classList.add("active");
  rightInd.setAttribute("aria-current", "true");
}

/**
 * Reverses the order of the carousel items (kanban columns) and slide indicators for the reverse cyclling.
 */
function reverseChildren() {
  MY_CAROUSEL.pause();
  let parentItems = document.getElementById("carousel-inner");
  let parentIndicators = document.getElementById("carousel-indicators");

  for (var i = 1; i < parentItems.childNodes.length; i++) {
    parentItems.insertBefore(parentItems.childNodes[i], parentItems.firstChild);
    parentIndicators.insertBefore(
      parentIndicators.childNodes[i],
      parentIndicators.firstChild
    );
  }
}

window.addEventListener("resize", () => setDataBsTouchOnWinResize());

/**
 * Sets the data-bs-touch attribute to true, if the window width is less than 576px, otherwise set it to false.
 */
function setDataBsTouchOnWinResize() {
  if (window.innerWidth < 576) {
    document.getElementById("carousel").setAttribute("data-bs-touch", "true");
  } else {
    document.getElementById("carousel").setAttribute("data-bs-touch", "false");
  }
}

/**
 * The index of the last selected user which should be assigned to the task open in the modal.
 * @type {number | undefined}
 * @default undefined
 */
let indexOflastSelectedUserOpenedModal;

/**
 * Opens the selected board task item in the modal.
 * @param {number} idValue - The value of the id of the selected board task item.
 */
function openModal(idValue) {
  let task = allTasks.find((n) => n.id == idValue);
  let indexTask = allTasks.findIndex((obj) => obj.id == idValue);
  indexOflastSelectedUserOpenedModal = findUserIndexForOpenModal(task);
  modalGenAllUser(idValue);
  document.getElementById("modalTitle").value = task.title;
  document.getElementById("modalDate").value = task.date;
  document.getElementById("modalCategory").value = task.category;
  document.getElementById("modalUrgency").value = task.urgency;
  document.getElementById("modalDescription").value = task.description;
  document.getElementById("modalSelectedUser").src = task.userForTask.avatar;
  renderButtons(indexTask);
  urgencyCol(task.urgency);
  modalHideAllUsers();
}

/**
 * Finds the index of the user (in the 'users' array) that is assigned to the task.
 * @param {JSON} task - The task opened in the modal window, for which the index of the assigned user should be finded.
 * @returns {number | undefined} The index in 'users' array of the finded user.
 */
function findUserIndexForOpenModal(task) {
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (
      user.avatar == task.userForTask.avatar &&
      user.email == task.userForTask.email &&
      user.name == task.userForTask.name &&
      user.password == task.userForTask.password
    ) {
      return i;
    }
  }
}

/**
 * Saves all changes in the open modal.
 *
 * @param {number} indexTask - The location of the task in alltasks.
 * @param {string} fct - The function name.
 */
async function adaptTask(indexTask, fct) {
  allTasks[indexTask].title = document.getElementById("modalTitle").value || "";
  allTasks[indexTask].date = document.getElementById("modalDate").value;
  allTasks[indexTask].category = document.getElementById("modalCategory").value;
  allTasks[indexTask].urgency = document.getElementById("modalUrgency").value;
  allTasks[indexTask].description =
    document.getElementById("modalDescription").value;
  allTasks[indexTask].userForTask = users[indexOflastSelectedUserOpenedModal];
  // allTasks[indexTask].userForTask.avatar = getRightSrcOfImg();
  await saveInBackend(allTasks, "allTasks");
  fct();
}

/**
 * Changes the assigned user in the task while open modal.
 * @param {number} i - The selected user.
 * @param {number} id - The id of the selected task.
 */
function changeSelectedUser(i, id) {
  let user = users[i];
  changeModalAvatarAfterSelect(user);
  indexOflastSelectedUserOpenedModal = i;
  modalGenAllUser(id);
}

/**
 * Changes the user avatar in the modal after selection of one of the user avatars from the drop down menu.
 * @param {JSON} user - The selected user from the drop dowm menu in the modal.
 */
function changeModalAvatarAfterSelect(user) {
  document.getElementById("modalSelectedUser").src = user.avatar;
}

/**
 * Switches the view in the modal between the selected user of the task and the scrollable container with all users to select.
 */
function modalShowAllUsers() {
  document.getElementById("modalSelectedUser").classList.toggle("d-none");
  document.getElementById("modalUserCollection").classList.toggle("d-none");
}

/**
 * Hides the open drop down menu of all user avatars in the modal.
 */
function modalHideAllUsers() {
  document.getElementById("modalSelectedUser").classList.remove("d-none");
  document.getElementById("modalUserCollection").classList.add("d-none");
}

/**
 * Generates all user avatars for the scrollable container: all users collection,
 * sets the blue border for avatar of the assigned user to the task,
 * sets the white border for the rest of user avatars.
 * @param {number} id - The value of id of the selected board task item.
 */
function modalGenAllUser(id) {
  let modalUserCollection = document.getElementById("modalUserCollection");
  modalUserCollection.innerHTML = "";
  for (let i = 1; i < users.length; i++) {
    const USER = users[i];
    if (indexOflastSelectedUserOpenedModal == i) {
      modalUserCollection.innerHTML += blueBorderImg(USER, i, id);
    } else {
      modalUserCollection.innerHTML += whiteBorderImg(USER, i, id);
    }
  }
}

/**
 * The HTML form element defining the type and scope of the HTML validation of the board modal.
 */
let formBoard = document.getElementById("boardSubmit");

formBoard.addEventListener("submit", handleFormIndex);

/**
 * The toast used while closing the modal in the board.
 */
const BOARD_TOAST = document.getElementById("boardToast");

/**
 * The instance of a bootstrap modal object used in the board (posibile edition of the task in the board modal).
 */
const MY_MODAL = new bootstrap.Modal(document.getElementById("staticBackdrop"));

/**
 * Shows the toast and closes the modal after 1 second.
 * @param {SubmitEvent} event - The returned event, which will be prevented.
 */
function handleFormIndex(event) {
  event.preventDefault();
  const TOAST = new bootstrap.Toast(BOARD_TOAST);
  TOAST.show();
  setTimeout(function () {
    MY_MODAL.hide();
  }, 1000);
}

window.addEventListener("resize", () => configDragDropPressHoldMode());

/**
 * Changes the conditions of the start of the dragging for smartphones.
 */
function configDragDropPressHoldMode() {
  if (window.innerWidth < 576) {
    DragDropTouch.DragDropTouch._ISPRESSHOLDMODE = true;
  } else {
    DragDropTouch.DragDropTouch._ISPRESSHOLDMODE = false;
  }
}