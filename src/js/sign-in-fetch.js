import * as signInFront from './sign-in-front.js';


const alertContainer = document.querySelector('.alert-container');
const loadingScreen = document.getElementById('loading-screen');


const siStudentIdInput = document.getElementById('si-studentid');
const siPassword = document.getElementById('si-password');
const siEmailInput = document.getElementById('si-email');
const siConfirmCodeInput = document.getElementById('si-code');
const siNewPassInput = document.getElementById('si-new-pass');

const siLoginBtn = document.getElementById('login-btn');
const siSendCodeBtn = document.getElementById('si-send-code-btn');
const siSubmitResetCodeBtn = document.getElementById('si-submit-code-btn');
const siChangePasswordBtn = document.getElementById('si-newPass-btn');

function alertAnimationListener(){ 
    const alert = document.querySelector('.alert');
    alert.addEventListener('animationend', () => {
        alert.remove();
        
        
    }) 
}

function reloadAfterAnimation() {
    const alert = document.querySelector('.alert');
    alert.addEventListener('animationend', () => {
        location.reload(); 
        
        
    })
}

siLoginBtn.addEventListener('click',async (event) => {
    event.preventDefault();
    
    if(!siStudentIdInput.value || !siPassword.value) {
        alertContainer.innerHTML = `<div role="alert" class="alert alert-warning animate-fadeoutThree">
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
            <span class="text-sm">All fields must be filled.</span>
        </div>`;
        
        alertAnimationListener();
        reloadAfterAnimation();
        return;
    }

    try {

        const response = await fetch('/pages/sign-in/login', {
            method : 'POST',
            headers : {
                'Content-Type' : 'application/json',
            },
            body : JSON.stringify({
                studentID : siStudentIdInput.value,
                password : siPassword.value
            })
        });
    
        const responseData = await response.json();

        if(!response.ok) {
            
            loadingScreen.classList.replace('flex', 'hidden');
            alertContainer.innerHTML = `
            <div role="alert" class="alert alert-warning animate-fadeoutTen">
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
            </div> 
            `;
            alertAnimationListener();
        }

        if(responseData.successLogin) {
            
            loadingScreen.classList.replace('flex', 'hidden');
            window.location.href = '/users/dashboard';
        }
        else {
            
            loadingScreen.classList.replace('flex', 'hidden');
            alertContainer.innerHTML = `
            <div role="alert" class="alert alert-warning animate-fadeoutTen">
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
            </div> 
            `;
            alertAnimationListener();
        }
    }
    catch(error){
        console.log(error.message);
        loadingScreen.classList.replace('flex', 'hidden');
        alertContainer.innerHTML = `
        <div role="alert" class="alert alert-error animate-fadeoutTen">
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
            <span class="text-sm">We encountered an issue while logging you in. Please try again later.</span>
            </div>`;
        alertAnimationListener();
    }

    


})


siSendCodeBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    loadingScreen.classList.replace('hidden', 'flex');

    if(!siEmailInput.value) {
        alertContainer.innerHTML = `<div role="alert" class="alert alert-warning animate-fadeoutThree">
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
            <span class="text-sm">Email field must be filled.</span>
        </div>`;
        
        alertAnimationListener();
        reloadAfterAnimation();
        return;
    }

    try {
        const response = await fetch('/pages/sign-in/login/send-code',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                email: siEmailInput.value
            })
        });
        
        const responseData = await response.json();

        if(!response.ok) {
            loadingScreen.classList.replace('flex', 'hidden');
            alertContainer.innerHTML = `
            <div role="alert" class="alert alert-warning animate-fadeoutTen">
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
            </div> 
            `;
            alertAnimationListener();
        }
        else {
            loadingScreen.classList.replace('flex', 'hidden');
            alertContainer.innerHTML = `
            <div role="alert" class="alert alert-success animate-fadeoutTen">
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
            </div> 
            `;
            
            alertAnimationListener();
            signInFront.hideEmailDisplaySubmit();
        }
    }
    catch {
        loadingScreen.classList.replace('flex', 'hidden');
        alertContainer.innerHTML = `
        <div role="alert" class="alert alert-warning animate-fadeoutTen">
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
        </div> 
        `;
        alertAnimationListener();
    }
})




