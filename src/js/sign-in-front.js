const studentIdInput = document.getElementById('si-studentid');
const passWordInput = document.getElementById('si-password');
const loginBtn = document.getElementById('login-btn');

const loginInputs = [studentIdInput, passWordInput];

const showHidePass = document.querySelectorAll('.show-hide-password');
const siLoginBtn = document.getElementById('password-btn');
const siPasswordInput = document.getElementById('si-password');

const forgotAnchor = document.getElementById('forgot-anchor')

const goBackBtn = document.getElementById('si-go-back-btn');
const sendCodeBtn = document.getElementById('si-send-code-btn');
 
const signInContainer = document.getElementById('si-login-input-container');
const forgotPassContainer = document.getElementById('forgot-password-container');
const siNewPasswordContainer = document.getElementById('si-changePass-container');

const siGetEmailContainer = document.getElementById('si-get-email-container');
const siSubmitCodeContainer = document.getElementById('si-submit-code-container');
const siSubmitCodeBtn = document.getElementById('si-submit-code-btn');
const siChangePassBtn = document.getElementById('si-newPass-btn');


function isInputsFilled(array) {
    for (const input of array) {
        if (input.value === "") {
            return false;
        }

    }
    return true;
}

function capitalizeInput(inputElement) {
    if (!inputElement) return; 
    
    inputElement.addEventListener('input', (event) => {
        inputElement.value = event.target.value.toUpperCase();
    });
};


capitalizeInput(studentIdInput)

function toggleButtonState(input, button) {
    input.addEventListener('input', () => {
        if (input.value.trim() === '') {
            button.disabled = true;
        } 
        else {
            button.disabled = false;
        }
    });
}
const siGetEmail = document.getElementById('si-email');
const siCode = document.getElementById('si-code');
const siNewPass = document.getElementById('si-new-pass');

toggleButtonState(siCode, siSubmitCodeBtn);
toggleButtonState(siNewPass, siChangePassBtn);

function validateEmail(event) {
    const emailInput = event.target;
    const email = emailInput.value;
    
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    
    const parentElement = document.querySelector('.label-err-container'); 
    const existingError = parentElement.querySelector('.error-message');

    if (existingError) {
        existingError.remove();
    }
    
    if (!emailRegex.test(email)) {
        const errorMessage = document.createElement('span');
        errorMessage.classList.add('text-sm', 'text-error', 'italic', 'font-medium', 'font-inter', 'error-message');
        errorMessage.textContent = 'Enter a valid email.';
        parentElement.appendChild(errorMessage);
        sendCodeBtn.disabled = true;
        
    } 
    else {
        if(existingError) {
            existingError.remove();
            sendCodeBtn.disabled = false;
        }
    }
}

// function addEmailValidation(inputsArray) {
//     inputsArray.forEach(input => {
//         input.addEventListener('blur', validateEmail); 
//     });
// }
siGetEmail.addEventListener('blur', validateEmail);
siGetEmail.addEventListener('focus', validateEmail);
siGetEmail.addEventListener('input', validateEmail);


loginInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(isInputsFilled(loginInputs)) {
            loginBtn.disabled = false;
        }
        else{
            loginBtn.disabled = true;
        }
    })
})

forgotAnchor.addEventListener('click', (event) => {
    event.preventDefault();

    

    signInContainer.classList.replace('flex', 'hidden');
    forgotPassContainer.classList.replace('hidden', 'flex');

    

})


showHidePass.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
    
        button.classList.toggle('show-password');
    })
});


siLoginBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if(siLoginBtn.classList.contains('show-password')) {
        siPasswordInput.type = 'text';
    }
    else {
        siPasswordInput.type = 'password';
    }
})

goBackBtn.addEventListener('click', (event) => {
    event.preventDefault();
    signInContainer.classList.replace('hidden', 'flex');
    forgotPassContainer.classList.replace('flex', 'hidden');

})


sendCodeBtn.addEventListener('click', (event) => {
    event.preventDefault();

    


    siGetEmailContainer.classList.replace('flex', 'hidden');
    siSubmitCodeContainer.classList.replace('hidden', 'flex');
})





siSubmitCodeBtn.addEventListener('click', (event) => {
    event.preventDefault();

    siSubmitCodeContainer.classList.replace('flex', 'hidden');
    siNewPasswordContainer.classList.replace('hidden', 'flex');   
})


siChangePassBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const loadingScreen = document.getElementById('loading-screen');

    loadingScreen.classList.replace('hidden', 'flex');
});
// Loading Screen when the user want to send code to email 
// sendCodeBtn.addEventListener('click', (event) => {
//     event.preventDefault();

//     const loadingScreen = document.getElementById('loading-screen');

//     loadingScreen.classList.replace('hidden', 'flex');
// })


loginBtn.addEventListener('click', (event) => {
    event.preventDefault();

    const loadingScreen = document.getElementById('loading-screen');

    loadingScreen.classList.replace('hidden', 'flex');
});


const notifAlert = document.querySelectorAll('.alert');
notifAlert.forEach(alert => {
    alert.addEventListener('animationend', () => {
        alert.remove();
    })  
})