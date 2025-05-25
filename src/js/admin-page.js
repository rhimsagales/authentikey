// Import alert functions
import { createWarningAlert, createErrorAlert, createSuccessAlert } from './alert.js';

// Import XLSX from CDN
const XLSX = window.XLSX;

function formatDate(dateString) { 
    // Extract date parts from the string (format: YYYY-MM-DDTHH:mm:ss.000)
    const [datePart] = dateString.split('T');
    const [year, month, day] = datePart.split('-');
    
    // Convert month number to short month name
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthName = monthNames[parseInt(month) - 1];
    
    return `${monthName} ${parseInt(day)}, ${year}`;
}

function getFirstColumnData(fileInput) {
    return new Promise((resolve, reject) => {
        const file = fileInput.files[0];

        if (!file) {
            reject(new Error('No file selected.'));
            return;
        }

        const reader = new FileReader();

        reader.onload = function(e) {
            try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];

            const firstColumn = [];
            let rowNum = 1;
            while (worksheet['A' + rowNum]) {
                firstColumn.push(worksheet['A' + rowNum].v);
                rowNum++;
            }
            resolve(firstColumn);
            } catch (error) {
            reject(error); // Reject the promise with the error
            }
        };

        reader.onerror = function(error) {
            reject(error); // Reject the promise with the error
        };

        reader.readAsArrayBuffer(file);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const menuIcon = mobileMenuBtn.querySelector('.menu-icon');
    const closeIcon = mobileMenuBtn.querySelector('.close-icon');

    mobileMenuBtn.addEventListener('click', () => {
        if(mobileNav.classList.contains('hide')) {
            mobileNav.classList.replace('hide', 'show');
            
        }
        else {
            mobileNav.classList.replace('show', 'hide');
        }
        menuIcon.classList.toggle('hidden');
        closeIcon.classList.toggle('hidden');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mobileNav.classList.contains('show')) {
            // mobileNav.classList.add('-translate-x-full');
            // menuIcon.classList.remove('hidden');
            // closeIcon.classList.add('hidden');
            mobileMenuBtn.click();
        }
    });

    // Get form and input elements
    const filterForm = document.getElementById('filterForm');
    const studentId = document.getElementById('studentId');
    const section = document.getElementById('section');
    const course = document.getElementById('course');
    const yearLevel = document.getElementById('yearLevel');
    const campus = document.getElementById('campus');
    const pcLab = document.getElementById('pcLab');
    const startDate = document.getElementById('startDate');
    const endDate = document.getElementById('endDate');
    const filter = document.getElementById('filter');
    const submitButton = document.getElementById('submitButton');
    const tableContainer = document.getElementById('tableContainer');
    const formContainer = document.getElementById('formContainer');

    // Add submit event listener to the form
    filterForm.addEventListener('submit', async function(e) {
        e.preventDefault();

        // Get values from inputs
        const formData = {
            studentID: studentId.value.trim(),
            section: section.value.trim(),
            course : course.value.trim(),
            yearLevel : yearLevel.value,
            campus : campus.value.trim(),
            pcLab : pcLab.value.trim().toString(),
            startDate: startDate.value,
            endDate: endDate.value,
            filter: filter.value
        };

        try {
            const response = await fetch('/firebase/get-filtered-logs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                // Hide form and show table
                formContainer.classList.add('hidden');
                tableContainer.classList.replace('hidden', 'flex');
                tableContainer.classList.add('flex-col');
                tableContainer.classList.add('items-center');
                tableContainer.classList.add('justify-start');
                
                // Set height for the parent containerformContainer.classList.add('hidden');
                // tableContainer.style.height = 'calc(100vh - 4rem)'; // Subtract header height or adjust as needed

                // Create and display the table with back button
                const tableHTML = `
                    <div class="flex justify-between mb-4 w-full">
                        <button id="downloadButton" class=" btn btn-primary bg-white text-black btn-sm rounded-full flex items-center gap-1 text-xs font-semibold hover:text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                            </svg>
                            Export to Xlsx
                        </button>
                        <button id="backButton" class="text-base-content btn btn-ghost btn-sm rounded-full font-medium flex items-center gap-1 text-xs">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="size-5">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                            Back
                        </button>
                    </div>
                    <div class="overflow-x-auto w-full mx-auto h-full rounded border border-gray-300 shadow-sm dark:border-gray-600">
                        <table id="logTable" class="min-w-full divide-y-2 divide-gray-200 dark:divide-gray-700">
                            <thead class="ltr:text-left rtl:text-right">
                                <tr class="*:font-medium">
                                    <th class="px-4 py-4 whitespace-nowrap text-center w-[160px] text-sm font-semibold">Student ID</th>
                                    <th class="px-4 py-4 whitespace-nowrap text-center w-[160px] text-sm font-semibold">Name</th>
                                    <th class="px-4 py-4 whitespace-nowrap text-center w-[160px] text-sm font-semibold">Section</th>
                                    <th class="px-4 py-4 whitespace-nowrap text-center w-[160px] text-sm font-semibold">Course</th>
                                    <th class="px-4 py-4 whitespace-nowrap text-center w-[160px] text-sm font-semibold">Year Level</th>
                                    <th class="px-4 py-4 whitespace-nowrap text-center w-[160px] text-sm font-semibold">Campus</th>
                                    <th class="px-4 py-4 whitespace-nowrap text-center w-[160px] text-sm font-semibold">Date</th>
                                    <th class="px-4 py-4 whitespace-nowrap text-center w-[160px] text-sm font-semibold">Time In</th>
                                    <th class="px-4 py-4 whitespace-nowrap text-center w-[160px] text-sm font-semibold">Time Out</th>
                                    <th class="px-4 py-4 whitespace-nowrap text-center w-[160px] text-sm font-semibold">PC Number</th>
                                    <th class="px-4 py-4 whitespace-nowrap text-center w-[160px] text-sm font-semibold">PC Lab no.</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                                ${data.logs.map(log => 
                                    `
                                    <tr class=" *:first:font-medium  ">
                                        <td class="px-4 py-4 whitespace-nowrap text-xs text-base-content w-[160px] text-center">${log.studentID}</td>
                                        <td class="px-4 py-4 whitespace-nowrap text-xs text-base-content w-[160px] text-center">${log.name}</td>
                                        <td class="px-4 py-4 whitespace-nowrap text-xs text-base-content w-[160px] text-center">${log.section}</td>
                                        <td class="px-4 py-4 whitespace-nowrap text-xs text-base-content w-[160px] text-center">${log.course}</td>
                                        <td class="px-4 py-4 whitespace-nowrap text-xs text-base-content w-[160px] text-center">${log.yearLevel}</td>
                                        <td class="px-4 py-4 whitespace-nowrap text-xs text-base-content w-[160px] text-center">${log.campus}</td>
                                        <td class="px-4 py-4 whitespace-nowrap text-xs text-base-content w-[160px] text-center">${formatDate(log.date)}</td>
                                        <td class="px-4 py-4 whitespace-nowrap text-xs text-base-content w-[160px] text-center">\u200B${log.timeIn}</td>
                                        <td class="px-4 py-4 whitespace-nowrap text-xs text-base-content w-[160px] text-center">\u200B${log.timeOut}</td>
                                        <td class="px-4 py-4 whitespace-nowrap text-xs text-base-content w-[160px] text-center">${log.pcNumber}</td>
                                        <td class="px-4 py-4 whitespace-nowrap text-xs text-base-content w-[160px] text-center">${log.pcLab}</td>
                                    </tr>
                                `).join('')}
                            </tbody>
                        </table>
                    </div>
                `;
                tableContainer.innerHTML = tableHTML;

                // Add event listener for back button
                document.getElementById('backButton').addEventListener('click', () => {
                    formContainer.classList.remove('hidden');
                    tableContainer.classList.replace('flex', 'hidden');
                    tableContainer.classList.remove('items-center');
                    tableContainer.classList.remove('justify-center');
                });

                // Add event listener for download button
                document.getElementById('downloadButton').addEventListener('click', () => {
                    // Get the table element
                    const table = document.getElementById('logTable');
                    
                    // Convert table to workbook
                    const wb = XLSX.utils.table_to_book(table);
                    
                    // Generate Excel file
                    XLSX.writeFile(wb, "Admin-Generated-Log.xlsx");
                });
            } else {
                // Show warning alert with server message
                createWarningAlert(data.message);
            }
        } catch (error) {
            // Show error alert
            createErrorAlert('An error occurred while fetching the logs. Please try again.');
            console.error('Error sending request:', error);
        }
    });


    const xlsxFileInput = document.querySelector('.xlsx-file-input');
    const xlsxFileInputTrigger = document.querySelector('.xlsx-file-input-trigger');
    const xlsxSubmitBtn = document.querySelector('.xlsx-file-submit-btn');

    xlsxFileInputTrigger.addEventListener('click', (e) => {
        e.preventDefault();
        
        xlsxFileInput.disabled = false; 
        xlsxFileInput.click()
    });

    xlsxFileInput.addEventListener('change', function() {
        if (this.files && this.files.length > 0) {
            console.log(this.files && this.files.length > 0)
            xlsxFileInput.classList.replace('hidden', 'block');
            xlsxSubmitBtn.disabled =  false;
            xlsxFileInput.disabled = true;
        }
        else {
            console.log(this.files && this.files.length > 0)
            xlsxSubmitBtn.disabled =  true;
        } 
        
    });

    xlsxSubmitBtn.addEventListener('click', async(e) =>{
        e.preventDefault();

        try {
            if(xlsxFileInput.files.length == 0){
                createWarningAlert("Please provide the file in Excel format (XLSX or XLS).");
                return
            }
            // console.log(xlsxFileInput.files == 0)
            const studentIDS = await getFirstColumnData(xlsxFileInput);
            const stringifiedStudentIDSArr = JSON.stringify({studentIDS});

            const response = await fetch('/admin/upload-student-ids', {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body : stringifiedStudentIDSArr
            });
            const responseData = await response.json();
            if(!response.ok) {
                createWarningAlert(responseData.message)
                return
            }
            createSuccessAlert("The IDs of eligible students have been successfully uploaded.");
        }
        catch {
            createErrorAlert("We ran into a few snags while uploading the Student IDs. Try again later.");
        }

    })
}); 


// let crShowModalBtns = document.querySelectorAll('.cr-show-modal-btns');
// let crHideModalBtns = document.querySelectorAll('.cr-hide-modal-btns');

// crShowModalBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//         document.body.classList.replace('overflow-y-visible', 'overflow-y-hidden');
//     })
// });
// crHideModalBtns.forEach(btn => {
//     btn.addEventListener('click', () => {
//         document.body.classList.replace('overflow-y-hidden', 'overflow-y-visible');
//     })
// });


const penAppRejBtns = document.querySelectorAll('.pen-app-rej-btns');
const crContainers = document.querySelectorAll('.cr-containers')

penAppRejBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.preventDefault();

        const targetText = e.target.innerText;

        penAppRejBtns.forEach(btn => {
            btn.classList.remove('active-pen-app-rej')
        });

        e.target.classList.add('active-pen-app-rej');

        crContainers.forEach(container => {
            if(container.classList.contains('flex')) {
                container.classList.replace('flex', 'hidden')
            }
        })

        switch(targetText) {
            case "Approved":
                crContainers[2].classList.replace('hidden','flex');
                break;
            case "Rejected":
                crContainers[1].classList.replace('hidden','flex');
                break;
            default:
                crContainers[0].classList.replace('hidden','flex');
                break;
            
            
        }
    })
})


const sections = document.querySelectorAll('.sections');
const adminLinks = document.querySelectorAll('.admin-links');




adminLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();

        

        if (e.target.nodeName !== "A" && e.target.nodeName !== "BUTTON") {
            e.target.closest("button").click();
            return;
        } else {
            const linkText = e.target.dataset.myValue;

            sections.forEach(section => {
                if (section.classList.contains('flex')) {
                    section.classList.replace('flex', 'hidden');
                }
            });

            switch (linkText) {
                case "Homepage":
                    sections[0].classList.replace('hidden', 'flex');
                    break;
                case "Analytics":
                    sections[1].classList.replace('hidden', 'flex');
                    break;
                case "Import Eligible Students":
                    sections[2].classList.replace('hidden', 'flex');
                    break;
                case "Correction Requests":
                    sections[3].classList.replace('hidden', 'flex');
                    break;
                case "Retrieve Logs":
                    sections[4].classList.replace('hidden', 'flex');
                    break;
                case "Delete Logs":
                    sections[5].classList.replace('hidden', 'flex');
                    break;
                case "Bug Report":
                    sections[6].classList.replace('hidden', 'flex');
                    break;
                
            }
        }
    });
});


async function sendAdminReportBugs(name, email, subject, message){
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

function isInputsFilled(inputs) {
    if (!inputs) {
        return false;
    }

    for (const inputElement of inputs) {
        if (!inputElement.value) {
            return false;
        }
    }
    return true;
}

const rbAdminForm = document.querySelector('.rbAdminForm');
const rbInputs = rbAdminForm.querySelectorAll('input, textarea');
const rbSubmitBtn = rbAdminForm.querySelector('button');

rbInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(isInputsFilled(rbInputs)) {
            rbSubmitBtn.disabled = false;
        }
        else {
            rbSubmitBtn.disabled = true;
        }
        
    });
});

rbSubmitBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    if(!isInputsFilled(rbInputs)) {
        createWarningAlert("All fields are required.")
    }

    const message = `Date: ${rbInputs[1].value}\n\n ${rbInputs[3].value}`
    const response = await sendAdminReportBugs("ADMIN", rbInputs[2].value, rbInputs[0].value, message);

    if(response.success) {
        createSuccessAlert("The email to the Authentikey Team was sent successfully.")
    }
    else {
        createErrorAlert("There is a problem sending an email.")
    }


})


const adminLogout = document.querySelectorAll('.admin-logout');


adminLogout.forEach(logoutLinks => {
    logoutLinks.addEventListener('click', async (e) => {
        e.preventDefault();
    
        const response  = await fetch('/user/admin-logout');
        if(response.ok) {
            window.location.reload();
        } else {
            createErrorAlert("Logout failed. Please try again.");
        }
        
    })
})


const roleManagementBtn = document.querySelectorAll('.role-management-btns');
const roleManagementontainer = document.querySelector('#role-management-modal-container');



if (roleManagementBtn.length > 0 && roleManagementontainer) {
    roleManagementBtn.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            if(roleManagementontainer.classList.contains('hidden')) {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth' 
                });
                roleManagementontainer.classList.replace('hidden', 'flex');
                document.body.classList.replace('overflow-y-visible', 'overflow-y-hidden');
            }
            else {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth' 
                });
                roleManagementontainer.classList.replace('flex', 'hidden');
                document.body.classList.replace('overflow-y-hidden', 'overflow-y-visible');
            }

        })
    })

    const adminTableShowHideBtns = document.querySelectorAll('.admin-table-show-hide-btns');

    adminTableShowHideBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            const row = e.currentTarget.closest('tr'); // Find the closest table row
            if (row) {
                const permissionInput = row.querySelector('.admin-input-permission');
                const passwordInput = row.querySelector('.admin-input-password');
                const inputs = [permissionInput, passwordInput];

                const firstSvg = e.currentTarget.querySelector('svg:nth-child(1)');
                const secondSvg = e.currentTarget.querySelector('svg:nth-child(2)');

                if (!e.currentTarget.classList.contains('show')) {
                    if (secondSvg) secondSvg.classList.replace('hidden', 'block');
                    if (firstSvg) firstSvg.classList.replace('block', 'hidden');
                    e.currentTarget.classList.toggle('show');
                    inputs.forEach(input => {
                    if (input) input.type = 'text';
                    });
                } else {
                    if (firstSvg) firstSvg.classList.replace('hidden', 'block');
                    if (secondSvg) secondSvg.classList.replace('block', 'hidden');
                    e.currentTarget.classList.toggle('show');
                    inputs.forEach(input => {
                    if (input) input.type = 'password';
                    });
                }
            }
        });
    });
}



const editAdminForm = document.querySelector('.edit-admin-form');
const editAdminInputs = editAdminForm.querySelectorAll('input, select');
const slicedEditAdminInputs = Array.from(editAdminInputs).slice(0, 3);


slicedEditAdminInputs.forEach(input => {
    input.addEventListener('input', () => {
        if(isInputsFilled(editAdminInputs)) {
            editAdminForm.querySelector('button').disabled = false;
        }
        else {
            editAdminForm.querySelector('button').disabled = true;
        }
    })
    
})
editAdminInputs[3].addEventListener('change', () => {
    if(isInputsFilled(editAdminInputs)) {
        editAdminForm.querySelector('button').disabled = false;
    }
    else{
        editAdminForm.querySelector('button').disabled = true;
    }
})




editAdminForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    editAdminForm.parentElement.querySelector('button').click();
    const formData = {
        currentUsername : editAdminInputs[0].value,
        newUsername : editAdminInputs[1].value,
        newPassword : editAdminInputs[2].value,
        newRole : editAdminInputs[3].value
    }
    const hasEmpty = Object.values(formData).some(value => value.trim() === '');

    if (hasEmpty) {
        createWarningAlert("All fields are required.");
        return
    }

    try {
        const response = await fetch('/admin/edit-admin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        
        if(!response.ok) {
            createWarningAlert("There was an error updating the admin details.");
            return
        }
        const data = await response.json();
        if(data.success) {
            const alertForAdmin = createSuccessAlert(data.message);

            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    for (const removedNode of mutation.removedNodes) {
                        if (removedNode === alertForAdmin) {
                            window.location.href = "/user/admin-logout"; // Reload the page
                            observer.disconnect(); // Stop observing
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true });
            
        }
        else {
            createWarningAlert(data.message);
        } 

    }
    catch (error) {
        createErrorAlert("There was an error updating the admin details. Please try again.");
        console.error('Error:', error);
    }
    
})

const deleteAdminForm = document.querySelector('.delete-admin-form');
const userNameToDelete = deleteAdminForm.querySelector('input');
const delButton = deleteAdminForm.querySelector('button');
userNameToDelete.addEventListener('input', () => {
    if(userNameToDelete.value == "") {
        delButton.disabled = true;
    }
    else {
        delButton.disabled = false;
    }
})

deleteAdminForm.addEventListener('submit', async(e) => {
    e.preventDefault();

    deleteAdminForm.parentElement.querySelector('button').click();
    console.log(userNameToDelete.value.trim())
    if(userNameToDelete.value == "") {
        createWarningAlert("All fields are required.")
        return
    }

    try {
        const response = await fetch('/admin/delete-credentials', {
            method : 'DELETE',
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                username : userNameToDelete.value.trim()
            })

        });
        const responseData = await response.json();
        if(!response.ok) {
            createWarningAlert(responseData.message);
            return
        }

        const alertForAdmin = createSuccessAlert(responseData.message);

        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                for (const removedNode of mutation.removedNodes) {
                    if (removedNode === alertForAdmin) {
                        window.location.href = '/user/admin-logout'; 
                        observer.disconnect(); 
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true });
    }
    catch(err) {
        console.log(err)
        createErrorAlert("We encountered some issues while deleting the account. Please try again.")
    }
})

const addAdminForm = document.querySelector('.add-admin-form');
const addAdminFormInputs = addAdminForm.querySelectorAll('input, select');
const slicedAddAdminInputs = Array.from(addAdminFormInputs).slice(0, 2);
const addAdminFormAddBtn = addAdminForm.querySelector('button');


slicedAddAdminInputs.forEach(input => {
    input.addEventListener('input', () => {
        const isFilled = Array.from(addAdminFormInputs).every(input => input.value.trim() !== '');
        addAdminFormAddBtn.disabled = !isFilled;
    });
});

addAdminFormInputs[2].addEventListener('change', () => {
    const isFilled = Array.from(addAdminFormInputs).every(input => input.value.trim() !== '');
    addAdminFormAddBtn.disabled = !isFilled;
})

addAdminForm.addEventListener('submit', async (e) =>{
    e.preventDefault();
    addAdminForm.parentElement.querySelector('button').click();
    const isFilled = Array.from(addAdminFormInputs).every(input => input.value.trim() !== '');

    if(!isFilled) {
        createWarningAlert("All fields are required.")
        return
    }
    try {
        const response = await fetch('/admin/create-credential', {
            method : 'POST',
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
                username : addAdminFormInputs[0].value.trim(),
                password : addAdminFormInputs[1].value.trim(),
                role : addAdminFormInputs[2].value
            })
        });
        const responseData = await response.json();

        if(!response.ok) {
            createWarningAlert(responseData.message)
            return
        }

        const alertForAdmin = createSuccessAlert(responseData.message);
        const observer = new MutationObserver((mutationsList) => {
            for (const mutation of mutationsList) {
                for (const removedNode of mutation.removedNodes) {
                    if (removedNode === alertForAdmin) {
                        window.location.href = '/user/admin-logout'; 
                        observer.disconnect(); 
                    }
                }
            }
        });
        observer.observe(document.body, { childList: true });

    }
    catch (err){
        console.log(err)
        createErrorAlert("We encountered some issues while creating the account. Please try again.")
    }
})


const deleteForm = document.querySelector('#delete-formContainer > form');
const deleteFormInputs = deleteForm.querySelectorAll('input, select');
const deleteFormButton = deleteForm.querySelector('button');


deleteFormInputs.forEach(input => {
    input.addEventListener('input', () => {
        const isFilled = Array.from(deleteFormInputs).some(input => input.value.trim() !== '');
        deleteFormButton.disabled = !isFilled;
    });
})

deleteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    deleteForm.querySelector('#delete-filtered-logs-confirmation-modal-close-btn').click();

    const deleteFormInputsObj = {
        studentID : deleteFormInputs[0].value.trim(),
        section : deleteFormInputs[1].value.trim(),
        course : deleteFormInputs[2].value.trim(),
        yearLevel : deleteFormInputs[3].value.trim(),
        campus : deleteFormInputs[4].value.trim(),
        startDate : deleteFormInputs[5].value.trim(),
        endDate : deleteFormInputs[6].value.trim(),
    }
    const isAllFieldsEmpty = Object.values(deleteFormInputsObj).every(value => value === "");

    if (isAllFieldsEmpty) {
        alert("Please fill in at least one filter field to delete specific logs. Mass deletion is disabled to prevent mistakes.");
        return; 
    }
    try {
        const response = await fetch('/admin/delete-logs', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(deleteFormInputsObj)
        });

        const data = await response.json();

        if (data.success) {
            createSuccessAlert(data.message);
        } 
        else {
            createWarningAlert(data.message);
        }
    } catch (error) {
        createErrorAlert('An error occurred while deleting logs. Please try again.');
        console.error('Error sending request:', error);
    }
    // deleteForm.reset(); 
})


const changePcPasswordForm = document.querySelector('#change-password-container-modal > div > div > form');
const changePcPasswordInput = changePcPasswordForm.querySelector('input');
const changePcPasswordUpdateBtn = changePcPasswordForm.querySelector('#update-pc-password-btn');

changePcPasswordInput.addEventListener('input', () => {
    const isFilled = changePcPasswordInput.value.trim() !== '';
    changePcPasswordUpdateBtn.disabled = !isFilled;
})

changePcPasswordForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    changePcPasswordForm.parentElement.querySelector('button').click();

    const newPcPassword = changePcPasswordInput.value.trim();

    if (newPcPassword === "") {
        createWarningAlert("Please enter a new PC password.");
        return;
    }

    try {
        const response = await fetch('/admin/change-pc-password', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ pcPassword: newPcPassword })
        });

        const data = await response.json();

        if (data.success) {
            createSuccessAlert(data.message);
        } else {
            createWarningAlert(data.message);
        }
    } catch (error) {
        createErrorAlert('An error occurred while changing the PC password. Please try again.');
        console.error('Error sending request:', error);
    }
})