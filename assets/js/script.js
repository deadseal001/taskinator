var pageContentEl = document.querySelector("#page-content");
var taskIdCounter =0;
var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

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
        type: taskTypeInput
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
        }
    }
    console.log(isEdit);

    //send it as an argumetn to createTaskEl
    createTaskEl(taskDataObj);
}


var createTaskEl= function(taskDataObj){

    // creat list item
    var listItemEl= document.createElement("li");
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
    console.log(taskActionsEl)    
    // add entire list item to list
    // listItemEl.textContent = taskNameInput;
    tasksToDoEl.appendChild(listItemEl);
    tasksToDoEl.appendChild(taskActionsEl);//wenbo added

    //increase task counter for next unique id
    taskIdCounter++;

}
var createTaskActions = function(taskId) {
    var actionContainerEl = document.createAttribute("div");
    actionContainerEl.className="task-actions";

    //creat edit buttion
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent="Edit";
    editButtonEl.className="btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    console.log(editButtonEl);
    actionContainerEl.appendChild(editButtonEl);///issue??

    //creat delete buttion
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent="Delete";
    deleteButtonEl.className="btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    //creat status select list
    var statusSelectEl= document.createElement("select");
    statusSelectEl.className="select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id",taskId);
    var statusChoices =["To Do", "In Progress", "Completed"];

    for (var i=0; i< statusChoices.length; i++){
        //create option element
        var statusOptionEl= document.createElement("option");
        statusOptionEl.textContent=statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        //append to select
        statusSelectEl.appendChild(statusOptionEl)
    }

    actionContainerEl.appendChild(statusSelectEl);

    return actionContainerEl;
}
formEl.addEventListener("submit",taskFormHandler);//why submit, not click? It will work with both button and enter key.

var taskButtonHandler = function(event) {
    console.log(event.target);

    var targetEl = event.target;

    //edit button was clicked
    if (targetEl.matches(".edit-btn")){
        var taskId =targetEl.getAttribute("data-task-id");
        editTask(taskId);
    }

    if(targetEl.matches(".delete-btn")){
        //get the element's task id
        var taskId=event.target.getAttribute("data-task-id");
        // console.log("you clicked a delete button!");
        deleteTask(taskId);
    }
}

//delete task function
var deleteTask = function(taskId){
    var taskSeleted = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    // console.log(taskId);
    taskSeleted.remove();
}

//edit task function
var editTask = function(taskId){
    console.log("editing task #" + taskId);

    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskID + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    console.log(taskName);

    var taskType = taskSelected.querySelector("span.task-type").textContent;
    console.log(taskType);
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;
    document.querySelector("#save-task").textContent = "Save Task";
    formEl.setAttribute("data-task-id",taskId);
}


//complete edit task function
var completeEditTask = function(taskName, taskType, TaskId) {
    console.log(taskName, taskType, taskId);

    //find the matching task list item
    var taskSelected = document.querySelector(".task-item[data-task-id='"+taskId+"']");

    //set new values
    taskSelected.querySelector("h3.task-name").textcontent = taskName;
    taskSelected.querySelector("span.task-type").textContent = taskType;

    alert("Task Updated!");
    formEl.removeAttribute("data-task-id");
    document.querySelector("#save-task").textContent= "Add Task";

};
pageContentEl.addEventListener("click",taskButtonHandler);
