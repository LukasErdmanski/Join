/**
 * Generates all tasks in the backlog.
 */
async function generateAllTasks() {
  allTasks = await loadFromBackend('allTasks');
  let backlogContainer = document.getElementById('freshTask');
  backlogContainer.innerHTML = '';
  for (let i = 0; i < allTasks.length; i++) {
    let newTask = allTasks[i];
    backlogContainer.innerHTML += newTaskTemp(newTask, i);
  }
}

/**
 * Filters and renders all task in the backlog according to search criteria.
 * Seach criteria can only be the name of the user or the task category.
 */
function filterNames() {
  let search = document.getElementById('searchTask').value;
  search = search.toLowerCase();
  document.getElementById('freshTask').innerHTML = ``;
  for (let i = 0; i < allTasks.length; i++) {
    let newTask = allTasks[i];
    let name = allTasks[i].userForTask.name;
    let category = allTasks[i].category;
    if (
      name.toLowerCase().includes(search) ||
      category.toLowerCase().includes(search)
    ) {
      document.getElementById('freshTask').innerHTML += newTaskTemp(newTask, i);
    }
  }
}
