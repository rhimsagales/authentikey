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

            if(!response.ok) {
                throw new Error();
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
                case "Retrieve Logs":
                    sections[0].classList.replace('hidden', 'flex');
                    break;
                case "Analytics":
                    sections[1].classList.replace('hidden', 'flex');
                    break;
                case "Correction Requests":
                    sections[2].classList.replace('hidden', 'flex');
                    break;
                case "Import Eligible Students":
                    sections[3].classList.replace('hidden', 'flex');
                    break;
                case "Bug Report":
                    sections[4].classList.replace('hidden', 'flex');
                    break;
                case "Homepage":
                    sections[5].classList.replace('hidden', 'flex');
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