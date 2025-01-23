const studentIdInput = document.getElementById('si-studentid');
const passWordInput = document.getElementById('si-password');
const loginBtn = document.getElementById('login-btn');

const loginInputs = [studentIdInput, passWordInput];

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
