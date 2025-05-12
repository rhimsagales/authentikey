import * as alertFunctions from './alert.js';


function isInputsFilled(array) {
    for (const input of array) {
        if (input.value === "") {
            return false;
        }

    }
    return true;
}

function isInputFilled(field) {
    if(field.value == "") {
        return false;
    }
    return true;
}


const adminUserNameField = document.getElementById('admin-username');
const adminPassWordField = document.getElementById('admin-password');
const adminLoginBtn = document.getElementById('admin-login-btn');
const showPassWordBtn = document.getElementById('show-pass-btn');
const form = document.querySelector('form');

const adminUserPassFields = [adminUserNameField, adminPassWordField];

form.addEventListener('keydown', (e)=> {
    

    if(e.key == "Enter") {
        e.preventDefault();
        adminLoginBtn.click();
    }
})



adminUserNameField.addEventListener('input', () => {
    if(adminUserNameField.value == "") {
        adminUserNameField.nextElementSibling.textContent = "A username is required."
        return
    }
    else {
        adminUserNameField.nextElementSibling.textContent = "";
        return
    }
});
adminUserNameField.addEventListener('focusout', () => {
    if(adminUserNameField.value == "") {
        adminUserNameField.nextElementSibling.textContent = "A username is required."
        return
    }
    else {
        adminUserNameField.nextElementSibling.textContent = "";
        return
    }
});

adminPassWordField.addEventListener('input', () => {
    if(adminPassWordField.value == "") {
        adminPassWordField.nextElementSibling.textContent = "A username is required."
        return
    }
    else {
        adminPassWordField.nextElementSibling.textContent = "";
        return
    }
});
adminPassWordField.addEventListener('focusout', () => {
    if(adminPassWordField.value == "") {
        adminPassWordField.nextElementSibling.textContent = "Password is required."
        return
    }
    else {
        adminPassWordField.nextElementSibling.textContent = "";
        return
    }
});


adminUserPassFields.forEach(field => {
    field.addEventListener('input', () => {
        if(isInputsFilled(adminUserPassFields)) {
            adminLoginBtn.disabled = false;
        }
        else {
            adminLoginBtn.disabled = true;
        }
    });
    field.addEventListener('focusout', () => {
        if(isInputsFilled(adminUserPassFields)) {
            adminLoginBtn.disabled = false;
        }
        else {
            adminLoginBtn.disabled = true;
        }
    });
});

const loadingScreen = document.querySelector('#loading-screen');
adminLoginBtn.addEventListener('click', async (event) => { 
    event.preventDefault();


    loadingScreen.classList.replace('hidden', 'flex');
    if(!isInputsFilled(adminUserPassFields)) {
        loadingScreen.classList.replace('flex', 'hidden');
        alertFunctions.createWarningAlert("All fields are required.");
        return;
    }

    try {
        const response = await fetch('/authenticate-admin', {
            method : "POST",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                username : adminUserNameField.value,
                password : adminPassWordField.value
            })
        });
        const responseData = await response.json();
        loadingScreen.classList.replace('flex', 'hidden');
        if(!response.ok){
            alertFunctions.createWarningAlert(responseData.message);
            return

        }
        window.location.href = "/users/admin-dashboard"; 
    }
    catch(e) {
        alertFunctions.createErrorAlert("We've encountered some probles while logging you in. Please try again later.")
    }
    


    
});


showPassWordBtn.addEventListener('click', (event) => {
    event.preventDefault();

    showPassWordBtn.classList.toggle('show-password');
    if(showPassWordBtn.classList.contains('show-password')) {
        adminPassWordField.type = "text";
    }
    else {
        adminPassWordField.type = "password";
    }
})

