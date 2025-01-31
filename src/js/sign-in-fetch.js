import * as signInFront from './sign-in-front.js';
// import emailjs from 'emailjs-com';

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

async function send(to, resetCode) {
    const templateParams = {
        to_email: to,
        reset_code: resetCode,
    };

    try {
        const response = await emailjs.send(
            'service_t08tvaj',   // Service ID
            'template_mk9iid6',  // Template ID
            templateParams,      // Template parameters
            'KcptGPY0Uy2sCiwpy'  // User ID
        );
        if(!response) {
            throw new Error("Theres something wrong.")
        }
        return { 
            success: true, 
            message: `The reset code has been successfully sent to your email: ${to}`,
            response: response
        };
    } catch (error) {
        return { 
            success: false, 
            message: `The reset code could not be sent to your email: ${to}`,
            error: error
        };
    }
}
async function deleteResetDocs(email, resetCode, expirationTime) {
    console.log(email)
    if(!email || !resetCode || !expirationTime){
        return { success: false, message: 'Invalid input' };
    }

    try {
        const response = fetch('/pages/sign-in/login/delete-code',{
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body : JSON.stringify({
                email: email,
                resetCode: resetCode,
                expirationTime: expirationTime
            })
        });
        const responseData = await response.json();

        if(!response.ok) {
            throw new Error(responseData.message);
        }
        else{
            return { success: true, message: responseData.message };
        }
    
    }
    catch(error) {
        return { success: false, message: error.message };
    }
}
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="text-sm">${responseData.message}</span>
            </div> 
            `;
            alertAnimationListener();
        }
        else {
            
            const sendEmail = await send(responseData.email, responseData.resetCode);

            if(sendEmail.success) {
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
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-sm">${sendEmail.message}</span>
                </div> 
                `;
                
                alertAnimationListener();
                signInFront.hideEmailDisplaySubmit();
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
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span class="text-sm">${sendEmail.message}</span>
                </div>
                `;
                alertAnimationListener();
                deleteResetDocs(responseData.email, responseData.resetCode, responseData.expirationTime);
                console.log('reached here')
            }
        
        }
    }
    catch(error) {
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
            <span class="text-sm">${error.message}</span>
        </div> 
        `;
        alertAnimationListener();
    }
})




siSubmitResetCodeBtn.addEventListener('click', async (event) => {
    event.preventDefault();

    try{
        loadingScreen.classList.replace('hidden', 'flex');

        if(!siConfirmCodeInput.value) {
            throw new Error("Please enter your reset code.")
        }

        const response = await fetch('/pages/sign-in/login/verify-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: siEmailInput.value,
                resetCode : siConfirmCodeInput.value 
            })
        });
        const data = await response.json();
        if(!response.ok) {
            throw {
                message: data.message,
                status: response.status
            };
        }
        else {
            loadingScreen.classList.replace('flex', 'hidden');
            signInFront.hideSubmitDisplayPass();
        }

    }
    catch(error) {
        if(error.status === 400){
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
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <span class="text-sm">${error.message}</span>
            </div> 
            `;
            alertAnimationListener();
        }
        else {
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
                <span class="text-sm">${error.message}</span>
            </div> 
            `;
            alertAnimationListener();
        }
    }
})

