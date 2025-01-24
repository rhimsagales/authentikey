const studentIdInput = document.getElementById('si-studentid');
const passWordInput = document.getElementById('si-password');
const loginBtn = document.getElementById('login-btn');

const loginInputs = [studentIdInput, passWordInput];

const showHidePass = document.querySelectorAll('.show-hide-password');
const siLoginBtn = document.getElementById('password-btn');
const siPasswordInput = document.getElementById('si-password');

function isInputsFilled(array) {
    for (const input of array) {
        if (input.value === "") {
            return false;
        }

    }
    return true;
}

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