// Import alert functions
import { createWarningAlert, createErrorAlert } from './alert.js';

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
                                <tr class="*:font-medium *:text-gray-900 dark:*:text-white">
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
                                    <tr class="*:text-gray-900 *:first:font-medium dark:*:text-white">
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
}); 