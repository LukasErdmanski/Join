/**
 * The current logged in user.
 */
let currentUser = [];

/**
 * All posible task categories.
 */
let allCategories = ["IT", "Sales", "Management", "Production", "Marketing"];

/**
 * All colors of task categories.
 */
let colorsCategory = {
  Sales: "#DC5445",
  IT: "#5F61B3",
  Production: "#C4A381",
  Management: "#E9E265",
  Design: "#BBD686",
  Marketing: "#EEF1BD",
};

/**
 * The Users saved in the backend server.
 */
let users = [];

/**
 * Initially executed while loading the login page. Downloads the 'users' and 'allTasks' JSON from backend server.
 */
async function init() {
  await setURL(
    "https://lukas-erdmanski.developerakademie.net/M10/smallest_backend_ever"
  );
  await downloadFromServer();
  users = (await JSON.parse(backend.getItem("users"))) || [];
  allTasks = (await JSON.parse(backend.getItem("allTasks"))) || [];
}

/**
 * Initially executed while loading the board page.
 */
async function initIndex() {
  checkIfLogin();
  await init();
  await includeHTML();
  await currentUserImage();
  document.getElementById("navBoard").classList.add("you-are-here");
  renderAllColumns();
  configDragDropPressHoldMode();
}

/**
 * Initially executed while loading the help page.
 */
async function initHelp() {
  checkIfLogin();
  await init();
  await includeHTML();
  await currentUserImage();
  document.getElementById("navHelp").classList.add("you-are-here");
  setHeight("helpScrollbarContent1");
  setHeight("helpScrollbarContent2");
}

/**
 * Initially executed while loading the backlog page.
 */
async function initBacklog() {
  checkIfLogin();
  await init();
  await includeHTML();
  await currentUserImage();
  generateAllTasks();
  document.getElementById("navInBacklog").classList.add("you-are-here");
  setHeight("freshTask");
}

/**
 * Initially executed while loading the add task page.
 */
async function initAddTask() {
  checkIfLogin();
  await init();
  await includeHTML();
  await currentUserImage();
  showAllUser();
  document.getElementById("addTaskNav").classList.add("you-are-here");
  loadCurrentDate();
  if (window.innerWidth < 503) {
    setHeight("addTaskSubmit");
  } else {
    removeHeight("addTaskSubmit");
  }
}

/**
 * Initially executed while loading every sub page (board, backlog, add task, help).
 * Inserts the navbar html template to all mentioned before sub pages.
 */
async function includeHTML() {
  let includeElements = document.querySelectorAll("[w3-include-html]");
  for (let i = 0; i < includeElements.length; i++) {
    const ELEMENT = includeElements[i];
    file = ELEMENT.getAttribute("w3-include-html");
    let resp = await fetch(file);
    if (resp.ok) {
      ELEMENT.innerHTML = await resp.text();
    } else {
      ELEMENT.innerHTML = "Page not found";
    }
  }
}

/**
 * Changes a relative link to an absolute link.
 * @returns {string} An absolute link.
 */
function getRightSrcOfImg(HTMLElementWithId) {
  let imgSrc = HTMLElementWithId.src;
  let indexSrc = imgSrc.indexOf("img");
  return "./" + imgSrc.substring(indexSrc, imgSrc.length);
}