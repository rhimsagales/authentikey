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

const adminUserPassFields = [adminUserNameField, adminPassWordField];

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

adminLoginBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if(!isInputsFilled(adminUserPassFields)) {
        alertFunctions.createWarningAlert("All fields are required.");
        return;
    }
    return
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