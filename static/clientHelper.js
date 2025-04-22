// this was placed in the static folder so that it would be correctly served to clients when they request it
// due to the security settings, only javascript that we include from the server will work (as opposed to javascript that we write in handlebars or directly in the html).


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
    InitializeAddTaskButton();
    InitializeAddUserButton();
    InitializeAllSelectAssigneeButtons();
    InitializeAllMarkCompleteButtons();
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
        UpdateProject(projectId_, {name:newName});
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
        closeButton.onclick = () => document.getElementById("expandedTaskView")?.classList.add("hidden");
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
    selectedActiveTaskData_ = {isComplete: GetIsCompleteFor(id)};

    taskData.classList.remove("hidden");
    const data = GetAllTaskJSONData(id);

    TryPopulateValue("expandedTaskName", data.name);
    TryPopulateValue("expandedDueDate", data.dueDate);
    TryPopulateTextContent("expandedAssignee", data.assignee);
    TryPopulateValue("expandedDescription", data.description);
    TryPopulateTextContent("expandedAssignee", data.assigneeInitials);

    TryPopulateTextContent("expandedMarkComplete", selectedActiveTaskData_.isComplete ? "Mark Uncomplete" : "Mark Complete");
}



function GetIsCompleteFor(id)
{
    const button = document.getElementById("markComplete" + id);
    if(button != null)
        return button.dataset.isComplete == "true";

    return false;
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
    const taskData = document.getElementById("taskData"+id);

    if(taskData == null)
        return {};   
    
    return GetAllTaskJSONDataFromParentElement(taskData);  
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
    if(foundElement == null)
        return;

    if(foundElement.textContent == undefined || foundElement.textContent.length == 0)
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
    const allButtons = document.getElementsByClassName("deleteTaskButton");
    for(button of allButtons)
    {
        let id = GetTaskIdOfArbitraryElement(button);
        if(id > 0)
            button.onclick = () => OnDeleteTaskClicked(id); // just going to pass the id of the selected task 
    }

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



function InitializeAddTaskButton()
{
    const addTaskButton = document.getElementById("addTaskButton");
    if(addTaskButton != null)
        addTaskButton.onclick = CreateTask;
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



function InitializeAddUserButton()
{
    const button = document.getElementById("addUserButton");
    if(button == null)
        return;

    button.onclick = OnAddUserClicked;    
}



async function OnAddUserClicked()
{
    // TODO: ensure that email is in valid format
    console.log("Client side validate here: ");
    

    const targetUrl = window.location.origin + "/user/"
    
    console.log("Saving new user to: " + targetUrl);
    const response = await fetch(targetUrl,
    {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(GetAllNewUserJSONData()) 
    });

    console.log(response);
    ForceRefresh();
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
        expandedUserButton.onclick = OnExpandedSelectAssigneeClicked;

    const allAssigneeButtons = document.getElementsByClassName("assigneeInitials");
    for(const button of allAssigneeButtons)
    {
        const id = GetTaskIdOfArbitraryElement(button);
        if(id > 0)
            button.onclick = () => OnSummarySelectAssigneeClicked(id);
    }
}



function OnExpandedSelectAssigneeClicked()
{
    taskIdForAssigneeChange_ = selectedActiveTaskId_;
}



function OnSummarySelectAssigneeClicked(taskId)
{
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



function OnConfirmAssigneeClicked(assigneeId)
{
    UpdateTask(taskIdForAssigneeChange_, {assigneeId:assigneeId}, true);
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



function OnMarkCompleteClicked(id, newValue)
{
    UpdateTask(id, {isComplete:newValue}, true);
}



/*
function InitializePlantFormNew()
{
    const form = document.getElementById("plantForm");
    if(form == null)
        return;

    form.addEventListener("submit", (event) =>
    {
        if(form.checkValidity() == true) 
            CreateCustomPostRequest(form);        

        event.preventDefault();
        event.stopPropagation(); // we never want to submit, because we're going to send a custom request to the server
        
        form.classList.add("was-validated");
        
    }, false);
}



async function CreateCustomPutRequest(form)
{
    try 
    {        
        console.log("Putting to: " + window.location.href);

        const response = await fetch(window.location.href,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(GetAllEditFormJSONData(form)) // edit data is the same as new data, so we can just re-use this
        });

        if(response.ok == false)
            window.location.href = "/plants/addFail";
    }
    catch
    {
    }
}



function InitializePlantFormEdit()
{
    const form = document.getElementById("plantFormEdit");
    if(form == null)
        return;

    form.addEventListener("submit", (event) =>
    {
        if(form.checkValidity() == true) 
            CreateCustomPutRequest(form);        

        event.preventDefault();
        event.stopPropagation(); // we never want to submit, because we're going to send a custom request to the server
        form.classList.add("was-validated");
        
    }, false);
}



async function CreateCustomPutRequest(form)
{
    try 
    {        
        const response = await fetch(window.location.href,
        {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(GetAllEditFormJSONData(form))
        });

        if(response.ok == false)       
            window.location.href = "/plants/changeFail";
    }
    catch
    {
    }
}



function GetAllEditFormJSONData(form)
{
    if(form == null)
        return {};

    const formData = new FormData(form);
    
    const data = 
    {
        plantLabel: formData.get("plantLabel"),
        species: formData.get("species"),
        plantDate: formData.get("plantDate"),
        wateringSchedule: formData.get("wateringSchedule"),
        lastWaterDate: formData.get("lastWaterDate"),
        notes: formData.get("notes")        
    };

    return data;
}



function InitializeDeleteConfirm()
{
    const button = document.getElementById("confirmDeleteButton");
    if(button == null)
        return;

    button.onclick = OnDeleteClicked;
}



// Handles delete requests when the user confirms a delete
async function OnDeleteClicked()
{    
    // splitting should make this a bit more safe, in the event that parameters were passed to the url
    let deletePath = (window.location.href.split('?')[0]);
    if(deletePath.endsWith("/") == false)
        deletePath += "/";

    deletePath += "delete";
    
    const response = await fetch(window.location.href,
        {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        });

        if(response.ok == true)       
            window.location.href = "/plants/deleteSuccess";
        else        
            window.location.href = "/plants/deleteFail";
}*/