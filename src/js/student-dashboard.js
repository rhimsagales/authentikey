
import * as alert from './alert.js';


class CustomError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}




function replaceSpaces(name) {
    return name.replace(/\s+/g, '_');
}


export function getCourseAbbreviation(courseName) {
    // Mapping of course names to their abbreviations
    const courseAbbreviations = {
        "Bachelor of Arts in Communication": "ABCom",
        "Bachelor of Arts in English": "ABEng",
        "Bachelor of Science in Mathematics": "BSM",
        "Bachelor of Science in Psychology": "BSP",
        "Associate in Business Administration": "ABA",
        "Bachelor of Science in Accounting Information System": "BSAIS",
        "Bachelor of Science in Accountancy": "BSA",
        "Bachelor of Science in Management Accounting": "BSMA",
        "Bachelor of Science in Real Estate Management": "BSREM",
        "Bachelor of Science in Internal Auditing": "BSIA",
        "Bachelor of Science in Business Administration": "BSBA",
        "Associate in Computer Technology": "ACT",
        "Bachelor of Science in Computer Science": "BSCS",
        "Bachelor of Science in Information Technology": "BSIT",
        "Bachelor of Science in Information System": "BSIS",
        "Bachelor in Early Childhood Education": "BECEd",
        "Bachelor in Elementary Education": "BEEd",
        "Bachelor in Secondary Education": "BSEd",
        "Bachelor in Technical Vocational Teacher Education": "BTVTEd",
        "Bachelor of Science in Marine Transportation": "BSMT",
        "Bachelor of Science in Criminology": "BSC",
        "Bachelor of Science in Industrial Security Management": "BSISM",
        "Bachelor of Science in Public Administration": "BSPA",
        "Bachelor of Science in Computer Engineering": "BSCE",
        "Bachelor of Science in Electronics Engineering": "BSELE",
        "Bachelor of Science in Medical Technology": "BSMedTech",
        "Bachelor of Science in Hospitality Management": "BSHM",
        "Bachelor of Science in Tourism Management": "BSTM"
    };
  
    // Retrieve and return the abbreviation, or a default message if not found
    return courseAbbreviations[courseName] || "Abbreviation not found";
}
  



const downloadQrBtn = document.querySelector('.download-qr');

downloadQrBtn.addEventListener('click', async (event) => {
    event.stopPropagation();
    event.preventDefault();

    
    let bondPaper = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Monomakh&display=swap" rel="stylesheet">
        <title>Authentikey ID</title>
        <style>
            * { padding: 0; box-sizing: border-box; }
            body { display: flex; align-items: center; justify-content: center; height: 100vh; background: rgb(250, 250, 250); margin: 0;}
            .bond-paper {
                width: 8.5in;
                height: 11in;
                background: white;
                box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .id-card {
                width: 2.5in;
                height: 3.5in;
                border-radius: 6px;
                display: flex;
                background: white;
                overflow: hidden;
                outline: 2px dashed rgb(236, 167, 43);
            }
            .left-panel {
                width: 30%;
                height: 100%;
                background: rgb(27, 32, 58);
                display: flex;
                flex-direction: column-reverse;
                align-items: center;
                justify-content: space-between;
                color: rgb(236, 167, 43);
            }
            .left-panel span {
                writing-mode: vertical-rl;
                transform: rotate(180deg);
                font-weight: 500;
                font-family: 'Arial', sans-serif;
                margin-bottom: 16px;
                font-family: 'Monomakh'; 
                
            }
            .left-panel div {
                width: 1px;
                height: 155px;
                background: rgb(236, 167, 43);
            }
            .right-panel {
                width: 70%;
                height: 100%;
                padding: 12px 8px;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-content: center;
                gap: 4px;
            }
            .header {
                display: flex;
                gap: 8px;
                align-items: center;
            }
            .header-text {
            height: 42px;
            width: full;
            height: 36.75px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            
            gap: 2px;
            }
            .header img {
                width: 42px;
                
                aspect-ratio: 16/14;
                border-radius: 4px;
                object-fit: cover;
            }
            .header-text h1 {
                font-size: 8px;
                font-weight: 600;
                color: rgb(27, 32, 58);
                margin: 0;
            }
            .header-text h6 {
                font-size: 6px;
                font-weight: 400;
                color: #3a3b39;
                margin: 0;
            }
            .qr-code {
                width: 152px;
                height: 152px;
                border: 2px solid rgb(236, 167, 43);
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 4px;
                box-sizing: border-box;
            }
            .details {
                text-align: center;
                display: flex;
                flex-direction: column;: ;
                align-items: center;
                justify-content: space-between;
                width: 100%;
                height: 120px;
                
            }
            .details div > h1 {
                font-size: 10px;
                font-weight: 600;
                font-family: 'Arial', sans-serif;
                margin-top: 8px;
                margin-bottom: 0;
                font-family: 'Monomakh';
                color: rgb(27, 32, 58);
            }
            .details div > span {
                font-size: 6px;
                font-weight: 400;
                font-weight: 400;
                color: #3a3b39;
                text-align: center;
                
            }
            .c-divider {
                width: 100%;
                height: 1px;
                background: rgb(236, 167, 43);
                margin: 4px 0;
            }
            .dots {
                display: flex;
                justify-content: center;
                gap: 2px;
            }
            .dot {
                width: 8px;
                height: 8px;
                background: rgb(27, 32, 58);
            }
            .dot:last-child {
                background: rgb(236, 167, 43);
            }
            .footer {
                margin-top: 12px;
                font-size: 10px;
                font-weight: 500;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 4px;
            }
        </style>
    </head>
    <body>
        <article class="bond-paper">
            <article class="id-card">
                <div class="left-panel">
                    <span>Authentikey ID Card</span>
                    <div></div>
                </div>
                <div class="right-panel">
                    <div class="header">
                        <img src="https://i.imgur.com/PFeoGdy.png" alt="ICCT Logo">
                        <div class="header-text">
                            <h1>ICCT College - Antipolo</h1>
                            <h6>J. Sumulong Street, Antipolo, <br>1870, Rizal</h6>
                        </div>
                    </div>
                    <div class="qr-code">
                        ${window.svg}
                    </div>
                    <div class="details">
                        <div style="display: flex; flex-direction: column; justify-content: center; align-items: center; width: 100%;">
                        <h1>${window.name}</h1>
                        <div class="c-divider"></div>
                        <span >${getCourseAbbreviation(window.course)}</span>
                        </div>
                        <div class="dots">
                            ${window.levelDots}
                        </div>
                        <span style="font-size: 10px; font-weight: 600; margin-top: 16px; display: block; color: rgb(27, 32, 58);">Student ID: ${window.studentID}</span>
                        <div class="footer">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" style="color: rgb(27, 32, 58);">
                                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                            </svg>
                            <span style="color: rgb(27, 32, 58); font-size: 8px;">${window.email}</span>
                        </div>
                    </div>
                </div>
            </article>
        </article>
    </body>
    </html>`;
    
    
    const response = await fetch('/generate-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: bondPaper}),
    });

    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${replaceSpaces(window.name)}-QR-ID.pdf`;
    link.click();    
        
    
})


const burgerBtn = document.getElementById('burger-btn');
const sidebar = document.getElementById('sidebar');
const navLinksButton = document.querySelectorAll('.desk-nav-btn');

const mobNavButton = document.querySelectorAll('.mob-nav-btn');

const myAccount = document.getElementById('my-account');
const myAccountTwo = document.getElementById('my-account-two');

const myAccountMenu = document.querySelector('.my-account-menu');
const myAccountMenuTwo = document.querySelector('.my-account-menu-two');


const load = document.querySelector('.load');
const mainDashboard = document.querySelector('.main-student-dashboard');
const mainRequest = document.querySelector('.main-request-correction');
const mainContact = document.querySelector('.main-contact-dev');


const customModal = document.querySelector('.custom-modal');
const viewProfAnchor = document.querySelectorAll('.view-profile');
const viewQrAnchor = document.querySelectorAll('.view-qr');
const signOutAnchor = document.querySelectorAll('.sign-out');
const profQrSignOutAnchor = [viewProfAnchor, viewQrAnchor, signOutAnchor];

const profileContainer = document.querySelector('.profile');
const viewQrCodeContainer = document.querySelector('.view-qr-code');
const viewPendingContainer = document.querySelector('.view-pending');


const disableScroll = (event) => event.preventDefault();

profQrSignOutAnchor.forEach(anchorArr => {
    anchorArr.forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();

            if(event.currentTarget.innerText == "Personal Information") {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth' 
                });
                
                customModal.classList.replace('hidden', 'flex');
                profileContainer.classList.replace('hidden', 'flex');
                
            }
            else if(event.currentTarget.innerText == "My QR Code") {
                window.scrollTo({
                    top: 0,
                    left: 0,
                    behavior: 'smooth' 
                });
                customModal.classList.replace('hidden', 'flex');
                viewQrCodeContainer.classList.replace('hidden', 'flex');
            }
            else {
                window.location.href = '/user/logout'
            }
            document.querySelector('body').classList.replace('overflow-y-auto', 'overflow-y-hidden');
            
            

        })
    })
})



burgerBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();

    sidebar.classList.toggle('expand');
    burgerBtn.classList.toggle('show-sidebar')
});


navLinksButton.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();

        // Ensure the clicked element is the button itself
        const clickedButton = event.currentTarget;

        // If the button is already active, hide the loading and return
        if (clickedButton.classList.contains('btn-primary')) {
            console.log('reached here');
            load.classList.replace('flex', 'hidden');
            return;
        }
        
        // Show loading
        load.classList.replace('hidden', 'flex');

        // Reset all nav buttons to 'btn-ghost'
        navLinksButton.forEach(btn => btn.classList.replace('btn-primary', 'btn-ghost'));
        // navLinksButton.forEach(btn => btn.classList.replace('btn-primary-content', 'btn-ghost-content'));

        // Set the clicked button to 'btn-primary'
        clickedButton.classList.replace('btn-ghost', 'btn-primary');

        // Sync with mobile navigation buttons
        const clickedText = clickedButton.innerText.trim();
        mobNavButton.forEach(btn => {
            btn.classList.toggle('selected', btn.innerText.trim() === clickedText);
        });

        // Handle navigation logic
        // Hide all sections properly by ensuring only 'hidden' remains
        mainDashboard.classList.remove('grid', 'flex');
        mainDashboard.classList.add('hidden');

        mainRequest.classList.remove('grid', 'flex');
        mainRequest.classList.add('hidden');

        mainContact.classList.remove('grid', 'flex');
        mainContact.classList.add('hidden');


        if (clickedText === "Dashboard") {
            mainDashboard.classList.replace('hidden', 'grid');
        } else if (clickedText === "Correction Request") {
            mainRequest.classList.replace('hidden', 'flex');
        } else {
            mainContact.classList.replace('hidden', 'flex');
        }

        // Hide loading after navigation
        load.classList.replace('flex', 'hidden');
    });
});



mobNavButton.forEach(button => {
    button.addEventListener('click', (event) => {
        event.preventDefault();

        const clickedButton = event.currentTarget;

        // Remove 'selected' from all mobile nav buttons
        mobNavButton.forEach(btn => btn.classList.remove('selected'));

        // Set clicked button as 'selected'
        clickedButton.classList.add('selected');

        // Reset all nav buttons to 'btn-ghost'
        navLinksButton.forEach(btn => btn.classList.replace('btn-primary', 'btn-ghost'));

        // Sync with desktop navigation buttons
        navLinksButton.forEach(btn => {
            if (clickedButton.innerText.trim() === btn.innerText.trim()) {
                btn.classList.replace('btn-ghost', 'btn-primary');
            }
        });

        // Handle navigation logic
        const clickedText = clickedButton.innerText.trim();

        // Hide all sections properly by ensuring only 'hidden' remains
        mainDashboard.classList.remove('grid', 'flex');
        mainDashboard.classList.add('hidden');

        mainRequest.classList.remove('grid', 'flex');
        mainRequest.classList.add('hidden');

        mainContact.classList.remove('grid', 'flex');
        mainContact.classList.add('hidden');

        // Show the correct section
        if (clickedText === "Dashboard") {
            mainDashboard.classList.replace('hidden', 'grid');
        } else if (clickedText === "Correction Request") {
            mainRequest.classList.replace('hidden', 'flex');
        } else {
            mainContact.classList.replace('hidden', 'flex');
        }

        // Hide loading after navigation
        load.classList.replace('flex', 'hidden');
    });
});



myAccount.addEventListener('click', (event) => {
    event.preventDefault();

    if(myAccountMenu.classList.contains('hidden')) {
        myAccountMenu.classList.replace('hidden', 'flex');
        myAccount.classList.add('open-modal');
    }
    else {
        myAccountMenu.classList.replace('flex', 'hidden');
        myAccount.classList.remove('open-modal');

    }
})

myAccountTwo.addEventListener('click', (event) => {
    event.preventDefault();

    if(myAccountMenuTwo.classList.contains('hidden')) {
        myAccountMenuTwo.classList.replace('hidden', 'flex');
        myAccountTwo.classList.add('open-modal');
    }
    else {
        myAccountMenuTwo.classList.replace('flex', 'hidden');
        myAccountTwo.classList.remove('open-modal');

    }
})


document.addEventListener('click', (event) => {
    if (!sidebar.contains(event.target) && !burgerBtn.contains(event.target) && sidebar.classList.contains('expand') && burgerBtn.classList.contains('show-sidebar')) {
        sidebar.classList.toggle('expand');
        burgerBtn.classList.toggle('show-sidebar');
    }
});


function filterTable(searchInput, table) {

    searchInput.addEventListener('input', function() {
        const searchTerm = searchInput.value.toLowerCase(); 
        const rows = table.querySelectorAll('tbody > tr');
    
        rows.forEach(row => {
            const cells = row.querySelectorAll('td'); 
            let match = false;
    
            cells.forEach(cell => {
            const cellText = cell.textContent.trim().toLowerCase();
    
            
            if (isValidDate(cellText)) {
                const date = parseDate(cellText); 
                if (date && date.includes(searchTerm)) {
                match = true;
                }
            } 
            else if (cellText.includes(searchTerm)) {
                match = true;
            }
        });
  
        
        if (match) {
            row.style.display = ''; 
            table.style.height ='auto'; 
        } 
        else {
            row.style.display = 'none'; 
        }
        });
    });
}
function isValidDate(dateStr) {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(dateStr);
}

function parseDate(dateStr) {
    const [day, month, year] = dateStr.split('/'); 
    return `${day}/${month}/${year}`; 
}

const table = document.querySelector('table');
const search = document.querySelector('.search')
filterTable(search, table)


const personalEditBtn = document.getElementById('change-personal-edit-btn');
const personalSaveCancelContainer = document.querySelector('.personal-save-cancel-container');
const cancelChangePersonalInfoBtn = document.getElementById('cancel-change-personal-info');

const newName = document.getElementById('new-name');
const newStudentId = document.getElementById('new-studId');
const newSection = document.getElementById('new-section');
const newEmail = document.getElementById('new-email');
const newCourse = document.getElementById('new-course');
const newYearLevel = document.getElementById('new-yearLevel');


const personalNewFieldArray = [newName, newStudentId, newSection, newEmail, newCourse, newYearLevel];

const originalContentsArray = [newName.innerText.trim(), newStudentId.innerText.trim(), newSection.innerText.trim(), newEmail.innerText.trim(), newCourse.innerText.trim(), newYearLevel.innerText.trim()]


personalEditBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();

    personalSaveCancelContainer.classList.replace('hidden', 'flex');

    personalNewFieldArray.forEach(field => {
        field.contentEditable = true;
    })
})
cancelChangePersonalInfoBtn.addEventListener('click', (event) => {
    event.preventDefault();

    personalSaveCancelContainer.classList.replace('flex', 'hidden');
    personalNewFieldArray.forEach(field => {
        field.contentEditable = false;
    });

    for(let i = 0; i < personalNewFieldArray.length; ++i) {
        personalNewFieldArray[i].innerText = originalContentsArray[i];
    }
})


const changePassEditBtn = document.getElementById('change-pass-edit-btn');
const changePassSaveCancelContainer = document.querySelector('.new-pass-save-cancel-container');
const cancelChangePassBtn = document.getElementById('cancel-change-pass');

const newPassField = document.getElementById('new-password');

changePassEditBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();

    changePassSaveCancelContainer.classList.replace('hidden', 'flex');
    newPassField.disabled = false;
});

cancelChangePassBtn.addEventListener('click', (event) => {
    event.stopPropagation();
    event.preventDefault();

    changePassSaveCancelContainer.classList.replace('flex', 'hidden');
    newPassField.disabled = true;
    newPassField.value = "";
});


const closeModalBtnArray = document.querySelectorAll('.close-modal');

closeModalBtnArray.forEach(closeModalBtn => {
    closeModalBtn.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        event.preventDefault();

        






        // setTimeout(() => {
        //     customModal.classList.replace('flex', 'hidden');
        //     document.querySelector('body').classList.replace('overflow-y-hidden', 'overflow-y-auto');

        //     profileContainer.classList.remove('flex');
        //     profileContainer.classList.remove('hidden');
        //     profileContainer.classList.add('hidden');

        //     viewQrCodeContainer.classList.remove('flex');
        //     viewQrCodeContainer.classList.remove('hidden');
        //     viewQrCodeContainer.classList.add('hidden');

        //     viewPendingContainer.classList.remove('flex');
        //     viewPendingContainer.classList.remove('hidden');
        //     viewPendingContainer.classList.add('hidden');
        // }, 800);

        customModal.classList.replace('flex', 'hidden');
        document.querySelector('body').classList.replace('overflow-y-hidden', 'overflow-y-auto');

        profileContainer.classList.remove('flex');
        profileContainer.classList.remove('hidden');
        profileContainer.classList.add('hidden');

        viewQrCodeContainer.classList.remove('flex');
        viewQrCodeContainer.classList.remove('hidden');
        viewQrCodeContainer.classList.add('hidden');

        viewPendingContainer.classList.remove('flex');
        viewPendingContainer.classList.remove('hidden');
        viewPendingContainer.classList.add('hidden');

        

    })
})

const crName = document.getElementById('cr-full-name');
const crEmail = document.getElementById('cr-email');
const crSubject = document.getElementById('cr-subject');
const crDateRecord = document.getElementById('cr-date-record');
const crCorrDetails = document.getElementById('cr-correction-details');

const crSubmitBtn = document.getElementById('cr-submit');

crSubmitBtn.addEventListener('click', async (event) => {
    event.preventDefault();


    await fetch('/check-session')
    .then(response => response.json())
    .then(data => {
        if (!data.loggedIn) {
            window.location.reload(); // Redirect if not logged in
        }
    });
    
    crSubmitBtn.disabled = true;
    try {
        if(!crName.value || !crEmail.value || !crSubject.value || !crDateRecord.value || !crCorrDetails.value ) {
            
            throw new Error('All fields are required.');
        }
        console.log('reached here')
        const response = await fetch('/send-correction-request', {
            method : 'POST',
            headers : { 'Content-Type' : 'application/json', },
            body : JSON.stringify({
                studentID : window.userData.studentID,
                fullName : crName.value,
                email : crEmail.value,
                subject : crSubject.value,
                dateRecord : crDateRecord.value,
                correctionDetails : crCorrDetails.value

            })
        });

        const responseData = await response.json();

        if(!response.ok) {
            throw new CustomError(responseData.message, responseData.status);
        }
        const alertDiv = alert.createSuccessAlert(responseData.message);
        alertDiv.addEventListener('animationend', () => {
            crSubmitBtn.disabled = false;
        });
    }
    catch(error) {
        console.log(error.statusCode);
        console.log(error.status);
        if(error.statusCode === 500 || error.statusCode === 400 || error.statusCode === 404){
            const alertDiv = alert.createErrorAlert(error.message);
            alertDiv.addEventListener('animationend', () => {
                crSubmitBtn.disabled = false;
            });
        }
        const alertDiv = alert.createErrorAlert("Oops! This action isn't allowed. Please check your request and try again.");
        
        alertDiv.addEventListener('animationend', () => {
            crSubmitBtn.disabled = false;
        });
        
        
    }
})



const rbName = document.getElementById('rb-name');
const rbEmail = document.getElementById('rb-email');
const rbSubject = document.getElementById('rb-subject');
const rbMessage = document.getElementById('rb-message');

const rbButton = document.getElementById('rb-button');


async function sendReportBugs(name, email, subject, message){
    const templateParams = {
        email : email,
        name : name,
        subject : subject,
        message : message
        
    };
    try {
        const responseFetch = await fetch('/pages/sign-in/change-pass/send/secret');

        const secrets = await responseFetch.json();
        const response = await emailjs.send(
            secrets.serviceID,   // Service ID
            "template_zshg8ei",  // Template ID
            templateParams,      // Template parameters
            secrets.publicID  // User ID
        );
        if(!response) {
            throw new Error("We ran into issues while sending your email.", 500)
        }

        return { 
            success: true, 
            message: `The email was successfully sent to the developers.`,
            statusCode: 200
        };
    } catch (error) {
        return { 
            success: false, 
            message: `The email could not be sent to this address: authentikey.icct.contact@gmail.com`,
            statusCode: 500
        };
    }
}


rbButton.addEventListener('click', async(event) => {
    event.preventDefault();
    
    await fetch('/check-session')
    .then(response => response.json())
    .then(data => {
        if (!data.loggedIn) {
            window.location.reload(); 
        }
    });


    rbButton.disabled = true;
    try {
        const inputs = [rbName, rbEmail, rbSubject, rbMessage];

        if (inputs.some(input => !input?.value)) {
            throw new CustomError("All fields are required.", 400);
        }

        const emailSendingStatus = await sendReportBugs(rbName.value, rbEmail.value, rbSubject.value, rbMessage.value);

        if(emailSendingStatus.statusCode == 500) {
            console.log(emailSendingStatus.statusCode)
            throw new CustomError(emailSendingStatus.message, emailSendingStatus.statusCode)
        }
        
        const alertDiv = alert.createSuccessAlert(emailSendingStatus.message);
        alertDiv.addEventListener('animationend', () => {
            rbButton.disabled = false;
        });
        console.log(emailSendingStatus);
        

    }
    catch(e) {
        if(e.statusCode == 400) {
            const alertDiv = alert.createWarningAlert(e.message);
            alertDiv.addEventListener('animationend', () => {
                rbButton.disabled = false;
            });
            return
        }
        else if (e.statusCode == 500) {
            const alertDiv = alert.createErrorAlert(e.message);
            alertDiv.addEventListener('animationend', () => {
                rbButton.disabled = false;
            });
            return
        }
        const alertDiv = alert.createErrorAlert("Oops! This action isn't allowed. Please check your request and try again.");
        alertDiv.addEventListener('animationend', () => {
            rbButton.disabled = false;
        });
        return
        
    }
    
})

const saveNewPersonalInfoBtn = document.getElementById("save-new-personal-info");

saveNewPersonalInfoBtn.addEventListener("click", async (event) => {
    event.stopPropagation();
    event.preventDefault();
    await fetch('/check-session')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.reload();
            }
        });

    const name = document.getElementById("new-name").innerText.trim();
    const newStudentID = document.getElementById("new-studId").innerText.trim();
    const email = document.getElementById("new-email").innerText.trim();
    const section = document.getElementById("new-section").innerText.trim();
    const course = document.getElementById("new-course").innerText.trim();
    const yearLevel = document.getElementById("new-yearLevel").innerText.trim();

    if (!name || !studentID || !email || !section || !course || !yearLevel) {
        alert.createWarningAlert("All fields are required.");
        return;
    }

    try {
        const response = await fetch("/user/update-personal-info", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentID: window.studentID ,name, newStudentID, email, section, course, yearLevel })
        });

        const data = await response.json();

        if (response.ok) {
            alert.createSuccessAlert(data.message);
            personalSaveCancelContainer.classList.replace('flex', 'hidden');
            personalNewFieldArray.forEach(field => {
                field.contentEditable = false;
            });
            setTimeout(() => {
                window.location.href = "/user/logout"
            
            }, 3000);
        } else {
            alert.createWarningAlert(data.message);
            personalSaveCancelContainer.classList.replace('flex', 'hidden');
            personalNewFieldArray.forEach(field => {
                field.contentEditable = false;
            });
        }
    } catch (error) {
        alert.createWarningAlert("Error updating personal info.");
        personalSaveCancelContainer.classList.replace('flex', 'hidden');
        console.error("Error updating personal info:", error);
        personalNewFieldArray.forEach(field => {
            field.contentEditable = false;
        });
    }
});



const saveNewPassBtn= document.getElementById("save-new-password");

saveNewPassBtn.addEventListener("click", async () => {
    await fetch('/check-session')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.reload();
            }
        });

    const password = document.getElementById("new-password").value.trim();
    const studentID = document.getElementById("new-studId").innerText.trim(); // Assuming student ID is needed

    if (!password) {
        console.log
        alert.createWarningAlert("All fields are required.");
        return;
    }

    try {
        const response = await fetch("/user/change-password", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password, studentID })
        });

        const data = await response.json();

        if (response.ok) {
            alert.createSuccessAlert(data.message);
            document.getElementById("new-password").disabled = false;
            document.getElementById("new-password").value = "";
            changePassSaveCancelContainer.classList.replace('flex', 'hidden');

        } else {
            alert.createWarningAlert(data.message);
            document.getElementById("new-password").disabled = false;
            document.getElementById("new-password").value = "";
            changePassSaveCancelContainer.classList.replace('flex', 'hidden');
        }
    } catch (error) {
        alert.createWarningAlert("Error updating password.");
        console.error("Error updating password:", error);
        document.getElementById("new-password").disabled = false;
        document.getElementById("new-password").value = "";
        changePassSaveCancelContainer.classList.replace('flex', 'hidden');  
    }
});


const deleteStudentBtn = document.getElementById('delete-student-btn');


deleteStudentBtn.addEventListener("click", async () => {
    await fetch('/check-session')
        .then(response => response.json())
        .then(data => {
            if (!data.loggedIn) {
                window.location.reload();
            }
        });

    const studentID = document.getElementById("new-studId").innerText.trim();

    if (!studentID) {
        alert.createWarningAlert("Student ID is required.");
        return;
    }

    try {
        const response = await fetch("/user/delete-student", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ studentID })
        });

        const data = await response.json();

        if (response.ok) {
            const alertDiv = alert.createSuccessAlert(data.message);
            
            alertDiv.addEventListener("animationend", () => {
                window.location.href = "/pages/sign-in";
            });
        } else {
            alert.createWarningAlert(data.message);
        }
    } catch (error) {
        alert.createWarningAlert("Error deleting student.");
        console.error("Error deleting student:", error);
    }
});


const pendingRequest = document.querySelector('.pendingRequest');


pendingRequest.addEventListener('click', (event) => {
    event.stopImmediatePropagation();
    event.preventDefault();

    customModal.classList.replace('hidden', 'flex');
    viewPendingContainer.classList.replace('hidden', 'flex');
    document.querySelector('body').classList.replace('overflow-y-auto', 'overflow-y-hidden');
    window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth' 
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

const reportInputs = document.querySelectorAll('.report-inputs');


reportInputs.forEach(input => {
    input.addEventListener('input', () => {
       
            if(isInputsFilled(reportInputs)) {
                rbButton.disabled = false;
                console.log(isInputsFilled(reportInputs))
            }
            else {
                rbButton.disabled = true;
                

            } 
    });
}); 



const correctionInputs = document.querySelectorAll('.correction-inputs');


correctionInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(isInputsFilled(correctionInputs)) {
            crSubmitBtn.disabled = false;
            
        }
        else {
            crSubmitBtn.disabled = true;
            

        } 
    });
});


const themeControllers = document.querySelectorAll('.theme-change');


themeControllers.forEach(controller => {
    controller.addEventListener('change', () => {
        if(document.documentElement.getAttribute('data-theme') ==  'fantasy') {
            document.documentElement.setAttribute("data-theme", "sunset")
        }
        else {
            document.documentElement.setAttribute("data-theme", "fantasy")
        }
        window.createChart(window.lastThreeMonthsLogins);
    })
        

        
        
})


const contactDevForm = document.querySelector('body > .main-contact-dev > form')

// contactDevForm.addEventListener('animationend', () => {
//     contactDevForm.style.opacity = "1";
// })