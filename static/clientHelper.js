// this was placed in the static folder so that it would be correctly served to clients when they request it
// due to the security settings, only javascript that we include from the server will work (as opposed to javascript that we write in handlebars or directly in the html).


document.addEventListener("DOMContentLoaded", () => 
{
    InitializePlantFormNew(); // form validation
    InitializePlantFormEdit(); // form validation and correctly creating a put request
    InitializeDeleteConfirm();
});



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
}