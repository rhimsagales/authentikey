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

profQrSignOutAnchor.forEach(anchorArr => {
    anchorArr.forEach(anchor => {
        anchor.addEventListener('click', (event) => {
            event.preventDefault();

            if(event.currentTarget.innerText == "Personal Information") {
                customModal.classList.replace('hidden', 'flex');
                profileContainer.classList.replace('hidden', 'flex');
            }
            else if(event.currentTarget.innerText == "My QR Code") {
                customModal.classList.replace('hidden', 'flex');
                viewQrCodeContainer.classList.replace('hidden', 'flex');
            }
            else {
                window.location.href = '/user/logout'
            }
            document.querySelector('body').classList.replace('overflow-y-auto', 'overflow-y-hidden')
            

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


const personalNewFieldArray = [newName, newStudentId, newSection, newEmail];

const originalContentsArray = [newName.innerText.trim(), newStudentId.innerText.trim(), newSection.innerText.trim(), newEmail.innerText.trim()]


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
        event.stopPropagation();
        event.preventDefault();

        customModal.classList.replace('flex', 'hidden');
        document.querySelector('body').classList.replace('overflow-y-hidden', 'overflow-y-auto');

        profileContainer.classList.remove('flex');
        profileContainer.classList.remove('hidden');
        profileContainer.classList.add('hidden');

        viewQrCodeContainer.classList.remove('flex');
        viewQrCodeContainer.classList.remove('hidden');
        viewQrCodeContainer.classList.add('hidden');

    })
})

