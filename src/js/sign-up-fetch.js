import * as signUpFunctions from './sign-up-front.js'


const suStudentId = document.getElementById('studentId');
const suPassword = document.getElementById('password');
const suRePassword = document.getElementById('repassword');
const suName = document.getElementById('name');
const suSection = document.getElementById('section');
const suEmail = document.getElementById('email');
const suAgreeCheckBox = document.getElementById('agreement-checkbox');

const suContinueBtn = document.getElementById('continue-btn');
const suRegisterBtn = document.getElementById('register-btn');

const loadingScreen = document.getElementById('loading-screen');

const alertContainer = document.querySelector('.alert-container');
const suSignInForm = document.querySelector('.signInForm');
const suBody = document.querySelector('body');


function alertAnimationListener(){ 
    const alert = document.querySelector('.alert');
    alert.addEventListener('animationend', () => {
        alert.remove();
        
        
    }) 
}
document.addEventListener('keydown', (event) => {
    

    if(event.key === "Enter") {
        event.preventDefault()
        if(suContinueBtn.classList.contains('hidden')){
            suRegisterBtn.click();
        }
        else {
            suContinueBtn.click();
        }
    }

})  

suContinueBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    const studentIDValue = suStudentId.value;

    loadingScreen.classList.replace('hidden', 'flex');
    suBody.classList.replace('py-6', 'py-0');
    suSignInForm.classList.replace('min-h-[654px]', 'max-h-svh');

    try {
        const response = await fetch('/pages/sign-up/check-studentid-availability', {
            method : 'POST',
            headers : {
                'Content-Type' :'application/json'
            },
            body : JSON.stringify({ studentID: studentIDValue })
        })
        const data = await response.json();
        if (!response.ok) {
            suBody.classList.replace('py-0', 'py-6');
            suSignInForm.classList.replace('max-h-svh', 'min-h-[654px]');

            suBody.classList.remove('max-h-svh');

            loadingScreen.classList.replace('flex', 'hidden');
            alertContainer.innerHTML = `<div role="alert" class="alert alert-warning animate-fadeoutTen">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">${data.message}</span>
            </div>`;
        
            alertAnimationListener();
        }

        
        
        console.log('Response:', data);

        if (data.available) {
            suBody.classList.replace('py-0', 'py-6');
            suSignInForm.classList.replace('max-h-svh', 'min-h-[654px]');

            suBody.classList.remove('max-h-svh');

            loadingScreen.classList.replace('flex', 'hidden');

            signUpFunctions.displaPersonalContainer();
            
            
            
        } 
        else {
            suBody.classList.replace('py-0', 'py-6');

            suSignInForm.classList.replace('max-h-svh', 'min-h-[654px]');

            suBody.classList.remove('max-h-svh');

            loadingScreen.classList.replace('flex', 'hidden');

            alertContainer.innerHTML = `<div role="alert" class="alert alert-warning animate-fadeoutTen">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">${data.message}</span>
            </div>`;
        
            alertAnimationListener();

            signUpFunctions.displayLoginContainer();
        }
    }
    catch (e){
        suBody.classList.replace('py-0', 'py-6');
        suSignInForm.classList.replace('max-h-svh', 'min-h-[654px]');

        suBody.classList.remove('max-h-svh');

        loadingScreen.classList.replace('flex', 'hidden');
        alertContainer.innerHTML = `<div role="alert" class="alert alert-error animate-fadeoutTen">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">Failed to check Student ID availability. Try again.</span>
        </div>`;
        alertAnimationListener();
        
        

    }
})

suRegisterBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    loadingScreen.classList.replace('hidden', 'flex');
    suBody.classList.replace('py-6', 'py-0');
    suSignInForm.classList.replace('min-h-[654px]', 'max-h-svh');


    try {
        const response = await fetch('/pages/sign-up/register-account', {
            method : 'POST',
            headers : {
                'Content-Type' :'application/json'
            },
            body : JSON.stringify({ 
                studentID : suStudentId.value,
                password : suPassword.value,
                confirmPassword : suRePassword.value,
                name : suName.value,
                section : suSection.value,
                email : suEmail.value,
                agreePolicy : suAgreeCheckBox.checked

            })
        });
        const responseData = await response.json();
        if(!response.ok) {
            suBody.classList.replace('py-0', 'py-6');
            suSignInForm.classList.replace('max-h-svh', 'min-h-[654px]');

            suBody.classList.remove('max-h-svh');

            loadingScreen.classList.replace('flex', 'hidden');
            alertContainer.innerHTML = `<div role="alert" class="alert alert-error animate-fadeoutTen">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">${responseData.message}</span>
            </div>`;
        
            alertAnimationListener();
        }
        
        if(responseData.successRegistration) {
            suBody.classList.replace('py-0', 'py-6');
            suSignInForm.classList.replace('max-h-svh', 'min-h-[654px]');

            suBody.classList.remove('max-h-svh');

            loadingScreen.classList.replace('flex', 'hidden');
            
            alertContainer.innerHTML = `
            <div role="alert" class="alert alert-success animate-fadeoutThree">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-6 w-6 shrink-0 stroke-current"
                    fill="none"
                    viewBox="0 0 24 24">
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sm">${responseData.message}</span>
            </div>`
            alertAnimationListener();
            const alert = document.querySelector('.alert');
            alert.addEventListener('animationend', () => {
                window.location.href = '/pages/sign-in';
            })
        }
        else {
            suBody.classList.replace('py-0', 'py-6');

            suSignInForm.classList.replace('max-h-svh', 'min-h-[654px]');

            suBody.classList.remove('max-h-svh');

            loadingScreen.classList.replace('flex', 'hidden');

            alertContainer.innerHTML = `<div role="alert" class="alert alert-error animate-fadeoutTen">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">${responseData.message}</span>
            </div>`;
        
            alertAnimationListener();
        }
    }
    catch(error) {
        suBody.classList.replace('py-0', 'py-6');
        suSignInForm.classList.replace('max-h-svh', 'min-h-[654px]');

        suBody.classList.remove('max-h-svh');

        loadingScreen.classList.replace('flex', 'hidden');
        alertContainer.innerHTML = `<div role="alert" class="alert alert-warning animate-fadeoutTen">
            <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6 shrink-0 stroke-current"
                fill="none"
                viewBox="0 0 24 24">
                <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-sm">${error.message}. Please try again later.</span>
            </div>`;
        
        alertAnimationListener();
    }
})



