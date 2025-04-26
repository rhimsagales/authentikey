

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
const courseinput = document.getElementById('course');
const yearLevelinput = document.getElementById('yearLevel');
const campusinput = document.getElementById('campus');
const agreeChckBox = document.getElementById('agreement-checkbox');
const selectPlacehoder = document.querySelector('.select-placeholder');

yearLevelinput.addEventListener('change', () => {
    
    console.log(yearLevelinput.value)
    console.log(selectPlacehoder.value)
    if(yearLevelinput.value == selectPlacehoder.value) {
       
        if(yearLevelinput.classList.contains('text-black')) {
            yearLevelinput.classList.replace('text-black', 'text-gray-400');
        }
        return
    }
    else {
        
        yearLevelinput.classList.replace('text-gray-400', 'text-black');
    }
})

// const errorText = document.getElementById('error-text');

const registerInputs = [studentIDinput, passwordinput,repasswordinput,  nameinput, sectioninput, courseinput, yearLevelinput, campusinput];
const loginInputs = [studentIDinput, passwordinput,repasswordinput];
const personalInputs = [nameinput, sectioninput, courseinput, emailinput, campusinput, yearLevelinput];

const bgImg = document.getElementById('bg-image');
const skeleton = document.getElementById('bg-skeleton');


// bgImg.addEventListener("load", () => {
//     bgImg.classList.replace('hidden', 'flex');
//     skeleton.classList.replace('flex', 'hidden');
// });


const bgContainer = document.querySelector('.bg-container');
const mainSignInContainer = document.querySelector('#sign-up-form');
const body = document.querySelector('body');
const cover = document.querySelector('.cover');

document.addEventListener('DOMContentLoaded', function() {
    cover.classList.replace('flex', 'hidden');
});
window.addEventListener('load', () => {
    
    bgContainer.classList.add('animate-fadeindown');
    mainSignInContainer.classList.add('animate-slideinup');
    
})
mainSignInContainer.addEventListener('animationend', () => {
    setTimeout(() => {
        
        body.classList.replace('overflow-y-hidden', 'overflow-y-auto');
    }, 2000);
})
// let viewportHeight = window.innerHeight;
// body.style.minHeight = `${viewportHeight}px`;


function capitalizeWordsExcept(str) {
    // Words to exclude from capitalization
    const exclude = ['of', 'in'];

    // Split the string into words
    return str.split(' ').map(word => {
        // Check if the word is in the exclude list
        if (exclude.includes(word.toLowerCase())) {
            return word.toLowerCase();
        }
        // Capitalize the first letter and add the rest of the word
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
}

courseinput.addEventListener('input', function() {
    // Get the current value of the input
    const currentValue = courseinput.value;

    // Capitalize words as needed
    const capitalizedValue = capitalizeWordsExcept(currentValue);

    // Update the input's value with the capitalized version
    courseinput.value = capitalizedValue;
});

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

emailinput.addEventListener('focusout', () => {
    
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
        console.log('focusout event ')
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
            if (errorTextElem) {
                errorTextElem.remove();
            }
        }
    });
});

registerInputs.forEach(input => {
    input.addEventListener('input', () => {
        console.log('it reached the event')
        const parentElement = input.parentElement;
        const errorTextElem = parentElement.querySelector('.err-txt');

        if (input.value === "") {
            console.log('if here')
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
            console.log('else here')
            if (errorTextElem) {
                errorTextElem.remove();
            }
        }
    });
});

yearLevelinput.addEventListener('focusout', () => {
    console.log('focusout event ')
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
        if (errorTextElem) {
            errorTextElem.remove();
        }
    }
});


// && !validateEmail(input.value)

export function isInputsFilled(array) {
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

    if (agreeChckBox.checked && isInputsFilled(personalInputs) && isInputsFilled(registerInputs) && emailinput.value && !validateEmail(emailinput.value)) {
        registerBtn.disabled = false;
    }
    else {
        registerBtn.disabled = true;
    }

    
});


yearLevelinput.addEventListener('change', () => {
    

    if (agreeChckBox.checked && isInputsFilled(personalInputs) && isInputsFilled(registerInputs) && emailinput.value && !validateEmail(emailinput.value)) {
        registerBtn.disabled = false;
    }
    else {
        registerBtn.disabled = true;
    }

    
});

personalInputs.forEach(input => {
    input.addEventListener('input', () => {
        // console.log(agreeChckBox.checked);
        // console.log(isInputsFilled(personalInputs));
        // console.log(isInputsFilled(registerInputs));
        // console.log(emailinput.value);
        
        if (agreeChckBox.checked && isInputsFilled(personalInputs) && isInputsFilled(registerInputs) && !validateEmail(emailinput.value)) {
            registerBtn.disabled = false;
        }
        else {
            registerBtn.disabled = true;
        }
    
        
    });
});


// registerInputs.forEach(input => {
//     input.addEventListener('input', () => {
//         if (!agreeChckBox || !personalInputs || !registerInputs || !emailinput) {
//             console.error("One or more required elements are missing");
//             return;
//         }

//         console.log(agreeChckBox.checked);
//         console.log(isInputsFilled(personalInputs));
//         console.log(isInputsFilled(registerInputs));
//         console.log(emailinput.value);

//         if (
//             agreeChckBox.checked && 
//             isInputsFilled(personalInputs) === true && 
//             isInputsFilled(registerInputs) === true && 
//             emailinput.value.trim() !== ""
//         ) {
//             console.log('here')
//             registerBtn.disabled = false;
//         } else {
//             registerBtn.disabled = true;
//         }
//     });
// });


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