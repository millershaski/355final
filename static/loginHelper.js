

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



function OnLoginClicked()
{
    lastClickedButton_ = "login";
    if(wasLoginSubmitted_ == false)
        return;

    console.log("OnClick");
}



function OnRegisterClicked()
{
    lastClickedButton_ = "register";
    if(wasLoginSubmitted_ == false)
        return;    
}