


document.addEventListener("DOMContentLoaded", () => 
{      
    InitializeAllLoginButtons();
});
    


function InitializeAllLoginButtons()
{
    const loginForm = document.getElementById("loginForm");
    if(loginForm != null)
        loginForm.addEventListener("submit", OnLoginFormSubmit);

    const loginButton = document.getElementById("loginButton");
    if(loginButton != null)
        loginButton.onclick = OnLoginClicked;

    const registerButton = document.getElementById("registerButton");
    if(registerButton != null)
        registerButton.onclick = OnRegisterClicked;
}



let wasLoginSubmitted_ = false;
let lastClickedButton_;

function OnLoginFormSubmit(event)
{
    wasLoginSubmitted_ = true;
    event.preventDefault(); // we'll manually submit

    if(lastClickedButton_ == "login")
        OnLoginClicked();
    else if(lastClickedButton_ == "register")
        OnRegisterClicked();
}



async function OnLoginClicked()
{
    lastClickedButton_ = "login";
    if(wasLoginSubmitted_ == false)
        return;

    targetUrl = window.location.origin + "/login/";
    SendToServer("PUT", targetUrl);
}



async function SendToServer(method, targetUrl)
{
    const username = GetElementTextContentOrValue("username");
    const password = GetElementTextContentOrValue("password");
    
    const response = await fetch(targetUrl,
    {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({username:username, password:password}) 
    });
    
    console.log(response);

    if(response.ok == false)
    {
        const errorDiv = document.getElementById('error-message');
        if(errorDiv != null)
        {
            const errorMessage = await response.text();
            errorDiv.textContent = errorMessage || "Login Failed";
            errorDiv.classList.remove('d-none');
        }
    }
    else
    {
        if(window.location.href.includes("/project/") == true) // if we're already in a project, just refresh
            location.reload();
        else
            window.location.href = '/project/1'; // Redirect on success
    }
}



async function OnRegisterClicked()
{
    lastClickedButton_ = "register";
    if(wasLoginSubmitted_ == false)
        return;    

    targetUrl = window.location.origin + "/register/";
    SendToServer("POST", targetUrl); 
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