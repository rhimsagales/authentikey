

const continueBtn = document.getElementById('continue-btn');
const registerBtn = document.getElementById('register-btn');
const backBtn = document.getElementById('back-btn');
const loginDetailsWrapper = document.getElementById('login-details-wrapper');
const personalDetailsWrapper = document.getElementById('info-details-wrapper');

const showHidePass = document.querySelectorAll('.show-hide-password');



const circleOne = document.getElementById('circle-one');
const circleTwo = document.getElementById('circle-two');



const studentIDinput = document.getElementById('studentId');
const passwordinput = document.getElementById('password');
const repasswordinput = document.getElementById('repassword');
const nameinput = document.getElementById('name');
const sectioninput = document.getElementById('section');
const emailinput = document.getElementById('email');
const agreeChckBox = document.getElementById('agreement-checkbox');

// const errorText = document.getElementById('error-text');

const registerInputs = [studentIDinput, passwordinput,repasswordinput,  nameinput, sectioninput, emailinput];
const loginInputs = [studentIDinput, passwordinput,repasswordinput];
const personalInputs = [nameinput, sectioninput, emailinput];

const bgImg = document.getElementById('bg-image');
const skeleton = document.getElementById('bg-skeleton');


// bgImg.addEventListener("load", () => {
//     bgImg.classList.replace('hidden', 'flex');
//     skeleton.classList.replace('flex', 'hidden');
// });




function validateEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return !emailRegex.test(email);
}

emailinput.addEventListener('input', () => {
    
    const parentElement = emailinput.parentElement;
    
    const errorTextElem = parentElement.querySelector('.err-txt');
    if (validateEmail(emailinput.value)) {
        
        if (errorTextElem) {
            errorTextElem.remove();
            const errorText = document.createElement('span');
            errorText.className = 'absolute top-[-26px] right-0 text-red-500 err-txt italic text-sm font-inter';
            errorText.textContent = 'Invalid Email.'; 
            parentElement.appendChild(errorText);
            
        }
        else {
            const errorText = document.createElement('span');
            errorText.className = 'absolute top-[-26px] right-0 text-red-500 err-txt italic text-sm font-inter';
            errorText.textContent = 'Invalid Email.'; 
            parentElement.appendChild(errorText);
            
        }
    } 
    else {
        
        if (errorTextElem) {
            errorTextElem.remove();
        }
    }
    
})

export function displaPersonalContainer() {
    loginDetailsWrapper.classList.replace('flex', 'hidden');
        
    personalDetailsWrapper.classList.replace('hidden', 'flex');

    continueBtn.classList.replace('btn', 'hidden');

    registerBtn.classList.replace('hidden', 'btn');
    backBtn.classList.replace('hidden', 'btn');

    agreeChckBox.classList.replace('hidden', 'flex');

    circleOne.classList.replace('bg-primary', 'bg-[#8d73ff]');
    circleTwo.classList.replace('bg-[#8d73ff]', 'bg-primary');

    circleOne.classList.replace('scale-125', 'scale-100');
    circleTwo.classList.replace('scale-100', 'scale-125');
}


export function displayLoginContainer() {
    loginDetailsWrapper.classList.replace('hidden', 'flex');
        
    personalDetailsWrapper.classList.replace('flex', 'hidden');

    continueBtn.classList.replace('hidden', 'btn');

    registerBtn.classList.replace('btn', 'hidden');
    backBtn.classList.replace('btn', 'hidden');

    agreeChckBox.classList.replace('flex', 'hidden');

    circleOne.classList.replace('bg-[#8d73ff]', 'bg-primary');
    circleTwo.classList.replace('bg-primary', 'bg-[#8d73ff]');

    circleOne.classList.replace('scale-100', 'scale-125');
    circleTwo.classList.replace('scale-125', 'scale-100');
}

backBtn.addEventListener('click', (event) => {
    event.preventDefault();

    loginDetailsWrapper.classList.replace('hidden', 'flex');
    
    personalDetailsWrapper.classList.replace('flex', 'hidden');

    continueBtn.classList.replace('hidden', 'btn');

    registerBtn.classList.replace('btn', 'hidden');
    backBtn.classList.replace('btn', 'hidden');

    agreeChckBox.classList.replace('flex', 'hidden');

    circleOne.classList.replace('bg-[#8d73ff]', 'bg-primary');
    circleTwo.classList.replace('bg-primary', 'bg-[#8d73ff]');

    circleOne.classList.replace('scale-100', 'scale-125');
    circleTwo.classList.replace('scale-125', 'scale-100');





});


registerInputs.forEach(input => {
    input.addEventListener('focusout', () => {
        
        const parentElement = input.parentElement;
        const errorTextElem = parentElement.querySelector('.err-txt');

        if (input.value === "") {
            if (!errorTextElem) {
                const errorText = document.createElement('span');
                errorText.className = 'absolute top-[-26px] right-0 text-red-500 err-txt italic text-sm font-inter';
                errorText.textContent = 'This field is required'; 
                parentElement.appendChild(errorText);
            }
            else {
                errorTextElem.remove();
                const errorText = document.createElement('span');
                errorText.className = 'absolute top-[-26px] right-0 text-red-500 err-txt italic text-sm font-inter';
                errorText.textContent = 'This field is required.'; 
                parentElement.appendChild(errorText);
                
            }
        } 
        else {
            if (errorTextElem && !validateEmail(input.value)) {
                errorTextElem.remove();
            }
        }
    });
});

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

capitalizeInput(studentIDinput);
capitalizeInput(sectioninput);

loginInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(isInputsFilled(loginInputs)) {
            if(repasswordinput.value == passwordinput.value) {
                continueBtn.disabled = false;
            }
            else {
                continueBtn.disabled = true;
            }
        }
        else {
            continueBtn.disabled = true;
        }
    })
})

agreeChckBox.addEventListener('change', () => {
    if(agreeChckBox.checked) {
        agreeChckBox.checked = false;

    }
    else {
        agreeChckBox.checked = true;
    }

    if (agreeChckBox.checked && isInputsFilled(personalInputs)) {
        registerBtn.disabled = false;
    }
    else {
        registerBtn.disabled = true;
    }

    
});

personalInputs.forEach(input => {
    input.addEventListener('input', () => {
        
        if (agreeChckBox.checked && isInputsFilled(personalInputs)) {
            registerBtn.disabled = false;
        }
        else {
            registerBtn.disabled = true;
        }
    
        
    });
});

passwordinput.addEventListener('input', (event) => {
    

    repasswordinput.disabled = false;
});


repasswordinput.addEventListener('input', () => {
    const parentElement = repasswordinput.parentElement;
    const errorTextElem = parentElement.querySelector('.err-txt');
    if (passwordinput.value != repasswordinput.value) {
        if(!errorTextElem){
            const errorText = document.createElement('span');
            errorText.className = 'absolute top-[-26px] right-0 text-red-500 err-txt italic text-sm font-inter';
            errorText.textContent = 'Password mismatch.'; 
            parentElement.appendChild(errorText);
        }
    
    }
    else {
        if(errorTextElem){
            errorTextElem.remove();
        }
    }
});

repasswordinput.addEventListener('focusout', () => {
    const parentElement = repasswordinput.parentElement;
    const errorTextElem = parentElement.querySelector('.err-txt');
    if (passwordinput.value != repasswordinput.value) {
        if(!errorTextElem){
            const errorText = document.createElement('span');
            errorText.className = 'absolute top-[-26px] right-0 text-red-500 err-txt italic text-sm font-inter';
            errorText.textContent = 'Password mismatch.'; 
            parentElement.appendChild(errorText);
        }
    
    }
    else {
        if(errorTextElem){
            errorTextElem.remove();
        }
    }
});



registerBtn.addEventListener('click', (event) => {
    event.preventDefault();
    registerBtn.disabled = true;
    const body = document.querySelector('body');
    const loadingScreen = document.getElementById('loading-screen');

    body.classList.replace('py-6', 'py-0')
    loadingScreen.classList.replace('hidden', 'flex');



})


showHidePass.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();
    
        button.classList.toggle('show-password');
    })
});

const repassBtn = document.getElementById('repassword-btn');
const passBtn = document.getElementById('password-btn');


repassBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if(repassBtn.classList.contains('show-password')) {
        repasswordinput.type = 'text';
    }
    else {
        repasswordinput.type = 'password';
    }
})

passBtn.addEventListener('click', (event) => {
    event.preventDefault();

    if(passBtn.classList.contains('show-password')) {
        passwordinput.type = 'text';
    }
    else {
        passwordinput.type = 'password';
    }
})


window.onload = () => {

    if (bgImg.complete && bgImg.naturalWidth !== 0) {
        bgImg.classList.replace('hidden', 'flex');
        skeleton.classList.replace('flex', 'hidden');
    }
    else {
        bgImg.addEventListener("load", () => {
            bgImg.classList.replace('hidden', 'flex');
            skeleton.classList.replace('flex', 'hidden');
        });
        bgImg.addEventListener("error", () => {
            skeleton.classList.replace('hidden', 'flex');
            bgImg.classList.replace('flex', 'hidden');
        });
    }
};