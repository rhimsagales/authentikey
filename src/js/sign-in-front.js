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