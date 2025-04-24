let selectedActiveTaskId_ = 0;
let selectedActiveTaskData_;

let taskIdForAssigneeChange_ = 0; // the id of the task that will have its assignee changed if the user confirms in the menu

let projectId_ = 0;


document.addEventListener("DOMContentLoaded", () => 
{      
    PopulateProjectId();
    InitializeProjectRename();

    InitializeAllExpandedTaskButtons();
    InitializeAllSaveButtons();
    InitializeAllDeleteButtons();
    InitializeCreateProjectButton();
    InitializeAddTaskButton();
    InitializeAddUserButton();
    InitializeAllSelectAssigneeButtons();
    InitializeAllMarkCompleteButtons();
    
    InitializeAllEditableInputs(); // this will register them to autosave
});



function PopulateProjectId()
{
    const projectData = document.getElementById("projectData");
    if(projectData != null)
        projectId_ = projectData.dataset.projectId;
}



function InitializeProjectRename()
{
    const renameButton = document.getElementById("saveProjectRename");
    if(renameButton != null)
        renameButton.onclick = OnProjectRenameConfirmed;
}



function OnProjectRenameConfirmed()
{
    const newName = GetElementTextContentOrValue("projectRenameValue");
    if(newName != null && newName.length > 0)
        UpdateProject(projectId_, {name:newName}, true);
}



function InitializeAllExpandedTaskButtons()
{
    const allButtons = document.getElementsByClassName("taskName");
    for(button of allButtons)
    {
        const id = GetTaskIdOfArbitraryElement(button);
        if(id > 0)
            button.onclick = () => ActivateExpandedTask(id);
    }

    const closeButton = document.getElementById("closeExpandedView");
    if(closeButton != null)
    {
        closeButton.onclick = () => 
        {
            document.getElementById("expandedTaskView")?.classList.add("hidden");
            selectedActiveTaskId_ = -1;
        };
    }
}



function GetTaskIdOfArbitraryElement(someElement)
{
    if(someElement == null)
        return 0;

    const taskData = someElement.closest(".taskData");
    if(taskData == null)
        return 0;

    return taskData.dataset.taskId;
}



async function ActivateExpandedTask(id)
{
    const taskData = document.getElementById("expandedTaskView");
    if(taskData == null)
        return;

    selectedActiveTaskId_ = id;
    taskData.dataset.taskId = id;

    taskData.classList.remove("hidden");
    PopulateExpandedTaskCardWith(id);
}



function GetIsCompleteFor(id)
{
    const allParentCards = document.getElementsByClassName("parentTaskData" + id);
    for(const parentCard of allParentCards)
    {
        if(parentCard.classList.contains("hidden") == false)
            return parentCard.dataset.isCompleteVersion == "true";
    }
}



function PopulateExpandedTaskCardWith(id)
{
    selectedActiveTaskData_ = {isComplete: GetIsCompleteFor(id)}

    const data = GetAllTaskJSONData(id);

    TryPopulateValue("expandedTaskName", data.name);
    TryPopulateValue("expandedDueDate", data.dueDate);
    TryPopulateTextContent("expandedAssignee", data.assignee);
    TryPopulateValue("expandedDescription", data.description);
    TryPopulateTextContent("expandedAssignee", data.assigneeInitials);

    TryPopulateTextContent("expandedMarkComplete", selectedActiveTaskData_.isComplete ? "Mark Uncomplete" : "Mark Complete");
}



function TryPopulateTextContent(elementName, value)
{
    const element = document.getElementById(elementName);
    if(element != null)
        element.textContent = value;
}



function TryPopulateValue(elementName, value)
{
    const element = document.getElementById(elementName);
    if(element != null)
        element.value = value;
}



function InitializeAllSaveButtons()
{
    const allButtons = document.getElementsByClassName("saveTaskButton");
    for(button of allButtons)
    {
        const id = GetTaskIdOfArbitraryElement(button);
        if(id > 0)
            button.onclick = () => SaveTask(id);
    }

    const foundButton = document.getElementById("expandedSaveButton");
    if(foundButton != null)
        foundButton.onclick = SaveExpandedTask;
}



async function SaveTask(id)
{
    const targetUrl = GetTargetUrlFromTaskId(id);
    
    console.log("Saving task data: " + id + " to " + targetUrl);
    const response = await fetch(targetUrl,
    {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(GetAllTaskJSONData(id)) 
    });

    console.log(response);
}



function GetTargetUrlFromTaskId(id)
{
    return window.location.origin + "/task/"+id;    
}



function GetAllTaskJSONData(id)
{
    const taskData = GetTaskDataFromId(id);

    if(taskData == null)
        return {};   
    
    return GetAllTaskJSONDataFromParentElement(taskData);  
}



function GetTaskDataFromId(id)
{
    return document.getElementById("taskData"+id);
}



function GetAllTaskJSONDataFromParentElement(parentElement)
{
    if(parentElement == null)
        return {};   
    
    const data = 
    {
        name: GetElementTextContentOrValue("taskName", parentElement),
        dueDate: GetElementValue("dueDate", parentElement),
        assigneeInitials: GetElementTextContent("assigneeInitials", parentElement),
        description: GetElementValue("description", parentElement)     
    };

    return data;    
}



function GetElementTextContentOrValue(elementName, taskData)
{
    const foundElement = FindElement(taskData, elementName); 
    return GetPassedElementTextContentOrValue(foundElement);
}



function GetPassedElementTextContentOrValue(foundElement)
{
    if(foundElement == null)
        return;

    if(foundElement.value != null && foundElement.value != undefined)
        return foundElement.value;
    else
        return foundElement.textContent;
}



function FindElement(parentElement, elementName)
{
    if(parentElement == null)
        return document.getElementById(elementName);
    else
        return parentElement.querySelector("." + elementName);  
}



function GetElementTextContent(elementName, taskData)
{
    const foundElement = FindElement(taskData, elementName); 
    if(foundElement == null)
        return;

    return foundElement.textContent;
}



function GetElementValue(elementName, taskData)
{
    const foundElement = FindElement(taskData, elementName); 
    if(foundElement == null)
        return;

    return foundElement.value;
}



async function SaveExpandedTask()
{
    const expandedTaskView = document.getElementById("expandedTaskView");
    if(expandedTaskView == null)
        return;

    const targetUrl = GetTargetUrlFromTaskId(selectedActiveTaskId_);
    
    console.log("Saving task data: " + selectedActiveTaskId_ + " to " + targetUrl);
    const response = await fetch(targetUrl,
    {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(GetAllTaskJSONDataFromParentElement(expandedTaskView)) 
    });

    console.log(response);
}



function InitializeAllDeleteButtons()
{
    const deleteButton = document.getElementById("deleteActiveTaskButton");
    if(deleteButton != null)
        deleteButton.onclick = () => {OnDeleteTaskClicked(selectedActiveTaskId_);}

    const confirmDelete = document.getElementById("confirmDeleteButton");
    if(confirmDelete != null)
        confirmDelete.onclick = OnDeleteConfirmed;
}



function OnDeleteTaskClicked(id)
{
    selectedActiveTaskId_ = id;
}



// Handles delete requests when the user confirms a delete
async function OnDeleteConfirmed()
{    
    let deletePath = GetTargetUrlFromTaskId(selectedActiveTaskId_);
    
    await fetch(deletePath,
    {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    ForceRefresh(); // force a refresh (regardless of response)
}



function ForceRefresh()
{
    location.reload(); 
}



function InitializeCreateProjectButton()
{
    const createProjectButton = document.getElementById("createProjectButton");
    if(createProjectButton != null)
        createProjectButton.onclick = CreateProject;
}



async function CreateProject()
{
    const targetUrl = window.location.origin + "/project/";
    await fetch(targetUrl,
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) 
    });
    
    ForceRefresh();
}



function InitializeAddTaskButton()
{
    const addTaskButton = document.getElementById("addTaskButton");
    if(addTaskButton != null)
        addTaskButton.onclick = CreateTask;

    const allAddSubtaskButtons = document.getElementsByClassName("addSubtaskButton");
    for(const subtaskButton of allAddSubtaskButtons)
    {
        const taskId = GetTaskIdOfArbitraryElement(subtaskButton);
        subtaskButton.onclick = () => {OnAddSubtaskClicked(taskId);}
    }
}



async function CreateTask()
{
    await fetch(GetTargetUrlFromTaskId(""),
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({projectId: projectId_}) 
    });
    
    ForceRefresh();
}



async function OnAddSubtaskClicked(parentId)
{
    await fetch(GetTargetUrlFromTaskId(""),
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({name: "subtask", parentTaskId: parentId}) 
    });
    
    ForceRefresh();
}



function InitializeAddUserButton()
{
    const openButton = document.getElementById("openAddUserButton");
    if(openButton != null)
        openButton.onclick = OnOpenAddUserClicked;

    const button = document.getElementById("addUserButton");
    if(button == null)
        return;

    button.onclick = OnAddUserClicked;    
}



function OnOpenAddUserClicked()
{ 
    const errorDiv = document.getElementById("errorMessageAddUser");
    if(errorDiv != null)
        errorDiv.classList.add('d-none'); // just hiding the error message in the event that something was previously there    
}



async function OnAddUserClicked()
{        
    const targetUrl = window.location.origin + "/user/"
    const data = GetAllNewUserJSONData();
    if(ValidateNewUserData(data) == false)
        return;
    
    const response = await fetch(targetUrl,
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data) 
    });

    if(response.ok == false)
    {
        const errorMessage = await response.text();
        DisplayErrorMessage(errorMessage || "Creating user failed", "errorMessageAddUser");        
    }
    else
        ForceRefresh();
}



// Displays an error and returns false if validation fails
function ValidateNewUserData(data)
{
    // Validate name
    if (data.name === "") 
    {
        DisplayErrorMessage("Name cannot be empty", "errorMessageAddUser")
        return false;
    }
    
    // Validate email format using regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (emailRegex.test(data.email) == false) 
    {
        DisplayErrorMessage("Please enter a valid email address", "errorMessageAddUser");
        return false;
    }

    return true;
}



function DisplayErrorMessage(message, elementId)
{
    const errorDiv = document.getElementById(elementId);
    if(errorDiv != null)
    {
        errorDiv.textContent = message;
        errorDiv.classList.remove("d-none");
    }
}



function GetAllNewUserJSONData()
{    
    const data = 
    {
        name: GetElementTextContentOrValue("newUserName"),
        email: GetElementTextContentOrValue("newUserEmail")   
    };

    return data;    
}



function InitializeAllSelectAssigneeButtons()
{
    InitializeAllOpenAssigneeMenuButtons();
    InitializeAllConfirmAssigneeButtons();
}



function InitializeAllOpenAssigneeMenuButtons()
{
    const expandedUserButton = document.getElementById("expandedAssignee");
    if(expandedUserButton != null)
        expandedUserButton.onclick = () => {OnExpandedSelectAssigneeClicked(expandedUserButton)};

    const allAssigneeButtons = document.getElementsByClassName("assigneeInitials");
    for(const button of allAssigneeButtons)
    {
        const id = GetTaskIdOfArbitraryElement(button);
        if(id > 0)
            button.onclick = () => {OnSummarySelectAssigneeClicked(id, button)};
    }
}



let lastUsedOpenAssigneeMenuElement_;
function OnExpandedSelectAssigneeClicked(element)
{
    lastUsedOpenAssigneeMenuElement_ = element;
    taskIdForAssigneeChange_ = selectedActiveTaskId_;
}



function OnSummarySelectAssigneeClicked(taskId, element)
{
    lastUsedOpenAssigneeMenuElement_ = element
    taskIdForAssigneeChange_ = taskId;
}



function InitializeAllConfirmAssigneeButtons()
{
    const allConfirmUserOptions = document.getElementsByClassName("confirmUserOption");
    for(const confirmButton of allConfirmUserOptions)
    {
        confirmButton.onclick = () => {OnConfirmAssigneeClicked(confirmButton.dataset.userId);}
    }
}



async function OnConfirmAssigneeClicked(assigneeId)
{
    await UpdateTask(taskIdForAssigneeChange_, {assigneeId:assigneeId}, false);    
    
    // simulate a click of the close button to hide the modal window
    const closeButton = document.getElementById("closeUserModalButton"); 
    if(closeButton != null)
        closeButton.dispatchEvent(new Event("click"));

    if(lastUsedOpenAssigneeMenuElement_ != null)
        lastUsedOpenAssigneeMenuElement_.dispatchEvent(new CustomEvent("change"));
}

 

async function UpdateTask(taskId, payload, forceRefresh)
{    
    const targetUrl = GetTargetUrlFromTaskId(taskId);
    
    const response = await fetch(targetUrl,
    {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
    });

    if(forceRefresh == true)
        ForceRefresh();
}



async function UpdateProject(projectId, payload, forceRefresh)
{
    const targetUrl = window.location.origin + "/project/"+projectId; 
    
    const response = await fetch(targetUrl,
    {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload) 
    });

    if(forceRefresh == true)
        ForceRefresh();
}



function InitializeAllMarkCompleteButtons()
{
    const allMarkCompleteButtons = document.getElementsByClassName("markComplete");
    for(const someButton of allMarkCompleteButtons)
    {
        const id = GetTaskIdOfArbitraryElement(someButton);
        if(id > 0)
            someButton.onclick = () => OnMarkCompleteClicked(id, !(someButton.dataset.isComplete == "true"));
    }

    const markCompleteButton = document.getElementById("expandedMarkComplete");
    if(markCompleteButton != null)
        markCompleteButton.onclick = () => {OnMarkCompleteClicked(selectedActiveTaskId_, !selectedActiveTaskData_.isComplete);}
}



async function OnMarkCompleteClicked(id, newValue)
{
    UpdateTask(id, {isComplete:newValue}, false);

    const taskData = GetTaskDataFromId(id)
    if(taskData != null)
    {
        if(taskData.dataset.isSubtask == "true") 
            RefreshIsCompleteOfSubtask(id, newValue);
        else 
            RefreshIsCompleteOfParentCard(id, newValue);
    }

    if(selectedActiveTaskId_ > 0) // repopulate if active (this covers subtasks too). Note that we'll be refreshing at times when we don't need to
        PopulateExpandedTaskCardWith(selectedActiveTaskId_);
}



function RefreshIsCompleteOfSubtask(id, newValue)
{
    // subtasks just need to have their checkboxes changed
    const checkbox = FindElement("markComplete");
    if(checkbox != null)
        checkbox.checked = newValue; // "change" event shouldn't be triggered with this
}



function RefreshIsCompleteOfParentCard(id, newValue)
{
    // non subtasks need to toggle the correct card's "hidden" value

    const allParentTaskData = document.getElementsByClassName("parentTaskData" + id);
    for(const parentElement of allParentTaskData)
    {
        const isCompleteVersion = parentElement.dataset.isCompleteVersion == "true"
        if(isCompleteVersion == newValue)
            parentElement.classList.remove("hidden");
        else    
            parentElement.classList.add("hidden");     
    }
}



function InitializeAllEditableInputs()
{
    InitializeEditableInputs("dueDate", "dueDate", "dueDate", "expandedDueDate");
    InitializeEditableInputs("description", "description", "description", "expandedDescription");
    InitializeEditableInputs("name", "name", "taskName", "expandedTaskName");
    InitializeEditableInputs(null, "assigneeInitials", "assigneeInitials", "expandedAssignee"); // assignee is a bit special, and the data is automatically sent to the server
}



function InitializeEditableInputs(outPropertyName, retrievedPropertyName, className, expandedTaskId)
{
    const allElements = document.getElementsByClassName(className);
    for(const someElement of allElements)
    {
        someElement.addEventListener("change", async (event) => 
        {            
            const id = GetTaskIdOfArbitraryElement(someElement); // found everytime so that expanded task works correctly (because the expanded task's id ca change all the time)
            if(outPropertyName != null)
                await UpdateTask(id, {[outPropertyName]: GetPassedElementTextContentOrValue(someElement)});

            RefreshElement(id, retrievedPropertyName, className, expandedTaskId);
        });
    }
}



// property name is the key of the key-value pair that will be returned when we fetch a GET
async function RefreshElement(taskId, propertyName, className, expandedTaskId)
{
    const newValue = await FetchTaskValue(taskId, propertyName);

    if(newValue == null || newValue == undefined)
        return;

    const allTaskData = document.getElementsByClassName("parentTaskData" + taskId);
    for(const taskData of allTaskData)
    {
        SetElementTextContentOrValue(newValue, taskData, className);
    }
    
    if(selectedActiveTaskId_ == taskId) // also refresh the element in expandedTask
        SetElementTextContentOrValue(newValue, null, expandedTaskId);
}



// fetches the passed task value from the server.
// note that the returned value is actually in the handlebars data format (as this is useful for clients)
async function FetchTaskValue(taskId, propertyName)
{
    const targetUrl = GetTargetUrlFromTaskId(taskId) + "?target=" + propertyName;
    
    const response = await fetch(targetUrl,
    {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    });

    const asJson = await response.json();
    return asJson.value;
}



function SetElementTextContentOrValue(newValue, taskData, elementName)
{
    const foundElement = FindElement(taskData, elementName); 

    if(foundElement != null)
    {
        if(foundElement.value != null && foundElement.value != undefined)
            foundElement.value = newValue;
        else
            foundElement.textContent = newValue;
    }
}