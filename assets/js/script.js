var taskIdCounter =0;

var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var pageContentEl = document.querySelector("#page-content");

//create array to hold tasks for saving
var tasks =[];

var taskFormHandler = function(event){
    event.preventDefault();//what does it mean??? It stops the browser from reloading the page

    var taskNameInput = document.querySelector("input[name='task-name']").value;
    // console.dir(taskNameInput);
    var taskTypeInput = document.querySelector("select[name='task-type']").value;
    //package up data as an object

    if(!taskNameInput || !taskTypeInput){
        alert("You need to fill out the task form!");
        return false;
    }

    formEl.reset();// reset the input to blank
    var taskDataObj={
        name: taskNameInput,
        type: taskTypeInput,
        status: "to do"
    }

    var isEdit = formEl.hasAttribute("data-task-id");
    //has data attribute, so get task id and call function to complete edit process

    if(isEdit){
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput,taskTypeInput,taskId);
    }
    //no data attribute, so create object as normal and pass to createTaskEl fucntion
    else {
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        }
    }
    console.log(isEdit);
    console.log(taskDataObj);

    //send it as an argumetn to createTaskEl
    createTaskEl(taskDataObj);
};


var createTaskEl= function(taskDataObj){
    // creat list item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
    //add task id as a custom attribute
    listItemEl.setAttribute("data-task-id",taskIdCounter);

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");
    //give it a class name
    taskInfoEl.className = "task-info";
    //add html content to div
    taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    var taskActionsEl = createTaskActions(taskIdCounter);
    // add entire list item to list
    listItemEl.appendChild(taskActionsEl);//wenbo added
    console.log(taskDataObj.status);
    switch (taskDataObj.status) {
        case "to do":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex =0;
            tasksToDoEl.appendChild(listItemEl);
            break;
        case "in progress":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);
            break;
        case "completed":
            taskActionsEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.append(listItemEl);
            break;
        default:
            console.log("Something went wrong!");
    }
    
    // save task as an object with name, type, status, and id properties then push it into tasks array
    taskDataObj.id=taskIdCounter;

    tasks.push(taskDataObj);

    console.log(tasks);
    //save task to local Storage
    saveTasks();

    //increase task counter for next unique id
    taskIdCounter++;
};

var createTaskActions = function(taskId) {
    //creat container to fold elements
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit buttion
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(editButtonEl);

    //create delete buttion
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent="Delete";
    deleteButtonEl.className="btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);
    actionContainerEl.appendChild(deleteButtonEl);

    //create status select list
    var statusSelectEl= document.createElement("select");
    statusSelectEl.className="select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id",taskId);
    actionContainerEl.appendChild(statusSelectEl);
    //create status options
    var statusChoices =["To Do", "In Progress", "Completed"];

    for (var i=0; i< statusChoices.length; i++){
        //create option element
        var statusOptionEl= document.createElement("option");
        statusOptionEl.textContent=statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl)
    }

    return actionContainerEl;
};

//complete edit task function
var completeEditTask = function(taskName, taskType, taskId) {
    console.log(taskName, taskType, taskId);
    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");

    //set new values
    taskSelected.querySelector("h3.task-name").textcontent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    //loop through tasks array and task object with new content
    for ( var i=0; i< tasks.length; i++) {
        if (tasks[i].id === parseInt(taskId)) {
            tasks[i].name =taskName;
            tasks[i].type = taskType;
        }
    }

    alert("Task Updated!");
    //remove data attribute from from
    formEl.removeAttribute("data-task-id");
    //update formEl button to go back to syaing "Add Task" instead of "Edit Task"
    formEl.querySelector("#save-task").textContent= "Add Task";
    saveTasks();
};

var taskButtonHandler = function(event) {
    console.log(event.target);
    //get target element from event
    var targetEl = event.target;

    //edit button was clicked
    if (targetEl.matches(".edit-btn")){
        console.log("edit", targetEl);
        var taskId =targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }
    else if(targetEl.matches(".delete-btn")){
        console.log("delete", targetEl);
        //get the element's task id
        var taskId=event.target.getAttribute("data-task-id");
        // console.log("you clicked a delete button!");
        deleteTask(taskId);
    }
};

var taskStatusChangeHandler = function(event){
    console.log(event.target);
    //get the task item's id
    var taskId = event.target.getAttribute("data-task-id");

    //find the parent task item element based on the id
    var taskSeleted = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get the currently selected option's value and convert to lowercase
    var statusValue =  event.target.value.toLowerCase();

    if(statusValue === "to do"){
        tasksToDoEl.appendChild(taskSeleted);
    }
    else if (statusValue === "in progress"){
        tasksInProgressEl.appendChild(taskSeleted);
    }
    else if (statusValue ==="completed"){
        tasksCompletedEl.appendChild(taskSeleted);
    }
    //update task's in tasks array
    for (var i=0; i < tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].status=statusValue;
        }
    }
    console.log(tasks);
    //save to localStorage
    saveTasks();
};

//edit task function
var editTask = function(taskId){
    console.log("editing task #" + taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);

    //write values of taskName and taskType to form to be edited
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    //set data Attribute to the form with a value of the taks's id so it knows which one is being edited
    formEl.setAttribute("data-task-id",taskId);
    //update form's butto to reflect editing a task rather than creating a new one.
    formEl.querySelector("#save-task").textContent = "Save Task";
}


//delete task function
var deleteTask = function(taskId){
    var taskSeleted = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // console.log(taskId);
    taskSeleted.remove();

    //create new array to hold updated list of atsks
    var updatedTaskArr=[];

    //loop through current tasks
    for (var i=0; i < tasks.length; i++){
        //if tasks[i].id doesn't match the value of taskId, let's keep that task and push it into the new array
        if (tasks[i].id !== parseInt(taskId)) {
            updatedTaskArr.push(tasks[i]);
        }
    }
    //reassign tasks array to be the same as updatedTaskArr
    tasks=updatedTaskArr;
    saveTasks();
}

var saveTasks = function(){
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks =function() {
    var savedTasks=localStorage.getItem("tasks");
    //if there are no tasks, set tasks to an empty array and return out of the function
    if(!savedTasks){
        tasks=[];
        return false;
    }

    console.log("Saved tasks found!");
    console.log(savedTasks);
    //load up saved tasks.
    //parse into array of objects
    savedTasks = JSON.parse(savedTasks);
    for (var i = 0; i< savedTasks.length; i++){
        //pass each task object into the 'createTaskEl()' function
        console.log(saveTasks[i]);
        createTaskEl(savedTasks[i]);
    };
}

//creat a new task
formEl.addEventListener("submit",taskFormHandler);//why submit, not click? It will work with both button and enter key.

//for edit and delete buttons
pageContentEl.addEventListener("click",taskButtonHandler);

//for changing the status
pageContentEl.addEventListener("change",taskStatusChangeHandler);

//loadTasks from local storage
loadTasks();