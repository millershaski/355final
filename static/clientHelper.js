// this was placed in the static folder so that it would be correctly served to clients when they request it
// due to the security settings, only javascript that we include from the server will work (as opposed to javascript that we write in handlebars or directly in the html).


document.addEventListener("DOMContentLoaded", () => 
{  
    InitializeAllSaveButtons();
    InitializeAllDeleteButtons();
    InitializeAddTaskButton();
});



function InitializeAllSaveButtons()
{
    const allButtons = document.getElementsByClassName("saveTaskButton");
    for(button of allButtons)
    {
        const id = GetTaskIdOfArbitraryElement(button);
        if(id > 0)
            button.onclick = () => SaveTask(id);
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



async function SaveTask(id)
{
    const taskData = document.getElementById("taskData"+id);
    const targetUrl = GetTargetUrlFromTaskId(id);
    
    console.log("Saving task data: " + id + " to " + targetUrl);
    const response = await fetch(targetUrl,
    {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(GetAllTaskJSONData(taskData)) 
    });

    console.log(response);
}



function GetTargetUrlFromTaskId(id)
{
    return window.location.origin + "/task/"+id;    
}



function GetAllTaskJSONData(taskData)
{
    if(taskData == null)
        return {};
   
    
    const data = 
    {
        dueDate: GetElementValue(taskData, "dueDate"),
        assignee: GetElementTextContent(taskData, "assignee"),
        description: GetElementValue(taskData, "description")     
    };

    console.log("PUTTING with data: " + JSON.stringify(data));
    return data;    
}



function GetElementTextContent(taskData, className)
{
    if(taskData == null)
        return null;

    const foundElement = taskData.querySelector("." + className);
    if(foundElement == null)
        return null;

    return foundElement.textContent;
}



function GetElementValue(taskData, className)
{
    if(taskData == null)
        return null;

    const foundElement = taskData.querySelector("." + className);
    if(foundElement == null)
        return null;

    return foundElement.value;
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



let selectedTaskId = 0;
function OnDeleteTaskClicked(id)
{
    selectedTaskId = id;
}



// Handles delete requests when the user confirms a delete
async function OnDeleteConfirmed()
{    
    let deletePath = GetTargetUrlFromTaskId(selectedTaskId);
    
    await fetch(deletePath,
    {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
    });

    location.reload(); // force a refresh (regardless of response)
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
        headers: { 'Content-Type': 'application/json' }
    });
    
    location.reload(); // force a refresh (regardless of response)
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