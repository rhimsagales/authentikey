import { getCourseAbbreviation } from './student-dashboard.js';


function updateTotalLoginsStatCard(loginThisWeek, loginLastWeek) { 
    let thisWeekLogins = loginThisWeek; 
    let lastWeekLogins = loginLastWeek; 

    let change = thisWeekLogins - lastWeekLogins; 
    let percentageChange = 0;

    if (lastWeekLogins > 0) {
        percentageChange = (change / lastWeekLogins) * 100;
    } else if (thisWeekLogins > 0) {
        percentageChange = "New Data"; // No previous logins, avoid misleading %
    }

    let isIncrease = change > 0;
    let isSame = change === 0;

    let bgColor = isIncrease ? 'bg-green-100 text-green-600' : (isSame ? 'bg-base-300 text-base-content' : 'bg-red-100 text-red-600');
    let iconPath = isIncrease ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : (isSame ? "M4 12h16" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6");

    let percentageText = typeof percentageChange === "number" ? `${percentageChange.toFixed(1)}%` : percentageChange;

    let totalLoginChildrens = `
    <div class="inline-flex items-center gap-2 self-end rounded-full ${bgColor} px-4 py-1 sm:py-[6px]">
        <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}" />
        </svg>
        <span class="text-[10px] sm:text-xs font-medium">
        ${percentageText}
        </span>
    </div>
    <div class="flex flex-col w-full gap-2">
        <strong class="block text-sm font-medium">Total Logins</strong>
        <p>
        <span class="text-2xl font-medium text-primary">${thisWeekLogins}</span>
        <span class="text-xs text-nowrap"> this week
            <span class="hidden sm:inline-flex">|
            <span class="font-semibold text-primary">&nbsp;${lastWeekLogins}&nbsp;</span>
            last week
            </span>
        </span>
        </p>
    </div>`;    

    let totalLoginStatCard = document.querySelector('.totalLoginWrapper');
    totalLoginStatCard.innerHTML = totalLoginChildrens;
}




function updateRecentUsedPCInfoCard(lastPcUsed, lastUsedDate) {
    let recentUsedWrapperChildren = `
    <div class="inline-flex items-center gap-2 self-end bg-blue-200 py-1 text-blue-600 px-4   rounded-full">
        <svg viewBox="0 0 24 24" id="_24x24_On_Light_Recent" data-name="24x24/On Light/Recent " xmlns="http://www.w3.org/2000/svg" fill="#2563eb" class="size-5 hidden sm:block">
        <g id="SVGRepo_bgCarrier" stroke-width="1.5">
        </g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
            <rect id="view-box" width="24" height="24" fill="none"></rect>
            <path id="Shape" d="M9.682,18.75a.75.75,0,0,1,.75-.75,8.25,8.25,0,1,0-6.189-2.795V12.568a.75.75,0,0,1,1.5,0v4.243a.75.75,0,0,1-.751.75H.75a.75.75,0,0,1,0-1.5H3a9.75,9.75,0,1,1,7.433,3.44A.75.75,0,0,1,9.682,18.75Zm2.875-4.814L9.9,11.281a.754.754,0,0,1-.22-.531V5.55a.75.75,0,1,1,1.5,0v4.889l2.436,2.436a.75.75,0,1,1-1.061,1.06Z" transform="translate(1.568 2.25)" fill="#2563eb">
            </path>
        </g>
        </svg>
        <span class="text-[10px] sm:text-xs font-medium">
        Recently Used
        </span>
    </div>

    <div class="flex items-center gap-3">
        <div class="flex flex-col  w-full gap-2">
        <strong class="block text-sm font-medium "> Last Used PC
        </strong>
        <p class="text-xl sm:text-2xl font-medium text-primary">
            Pc-${lastPcUsed}
            <span class="text-[11px] text-base-content ">
            <span class="hidden sm:inline-flex">Last Used: </span> 
            ${lastUsedDate}
            </span>
        </p>
        </div>

    </div>
    `;

    let recentUsedWrapper = document.querySelector('.recentUsedWrapper');

    recentUsedWrapper.innerHTML = recentUsedWrapperChildren;
}


function updatePendingRequestInfoCard(correctionRequestCount) {
    let pendingRequestWrapper = document.querySelector('.pendingRequest > article');
    
    let pendingRequestChildrens = `
        <div class="inline-flex items-center gap-2 self-end  bg-yellow-200 p-1 text-yellow-600 px-4  rounded-full">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5 hidden sm:block">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span class="text-[10px] sm:text-xs font-medium">
            Pending Requests
          </span>
        </div>

        <div class="flex items-center gap-3">
          <div class="flex flex-col  w-full gap-2">
            <strong class="block text-sm font-medium"> Requests Awaiting
              Approval </strong>
            <p class="text-2xl text-primary  font-semibold">
                ${correctionRequestCount}
            </p>

          </div>
        </div>
    `;

    pendingRequestWrapper.innerHTML = pendingRequestChildrens;
}


function formatDate(dateString) { 
    const date = new Date(dateString); 
    if (isNaN(date)) {
        return "Invalid Date"; 
    }

    // // Adjust for UTC-8 (convert from UTC to UTC-8) and then to Philippines Time (UTC+8)
    // const adjustedDate = new Date(date);
    // adjustedDate.setHours(adjustedDate.getHours() + 8); // Convert to UTC+8 (Philippines timezone)

    // Format the date string to "Month Day Year" (e.g., "Feb 24 2025")
    const parts = date.toUTCString().split(" ");
    return `\u200B${parts[2]} ${parts[1]}, ${parts[3]}`;







} 


function updateTable(allLogs){
    let tableBody = document.querySelector('.table-user > div > table > tbody');
    let tableLoadingScreen = document.querySelector('.table-user > div > #table-loading-screen');
    if(tableLoadingScreen) {
        tableLoadingScreen.remove();
    }
    let counter = 1;
    let tableRows = ``;

    if (Array.isArray(allLogs)) {
        for (let docs of allLogs) {
            let row = `
            <tr class="odd:bg-base-200   hover:bg-base-300 hover:cursor-pointer">
                <td class="px-6 py-3 font-medium text-base-content text-nowrap max-h-[48px] h-12 ">
                ${counter}
                </td>
                <td class="px-6 py-3 font-medium text-base-content text-nowrap max-h-[48px] h-12 ">
                ${window.userData.name}
                </td>
                <td class="px-6 py-3 font-medium text-base-content text-nowrap max-h-[48px] h-12 ">
                ${formatDate(docs.date)}
                </td>
                <td class="px-6 py-3 font-medium text-base-content text-nowrap max-h-[48px] h-12 ">
                ${docs.timeIn}
                </td>
                <td class="px-6 py-3 font-medium text-base-content text-nowrap max-h-[48px] h-12 ">
                ${docs.timeOut}
                </td>
                <td class="px-6 py-3 font-medium text-base-content text-nowrap max-h-[48px] h-12 ">
                ${docs.pcNumber}
                </td>
            </tr>
            
            `;
            tableRows += row;
            counter += 1;
        }
        tableBody.innerHTML = tableRows;

    }
    


}

function updateCourseFieldInPersonalInfo() {
    let courseField = document.getElementById('new-course');
    courseField.innerText = getCourseAbbreviation(window.userData.course);
    return;
}

function updateCorrectionRequesTable(requests) {
    let counter = 1
    let rows = '';
    let correctionRequestTableBody = document.querySelector('.correction-request-table > tbody');
    for(let request of requests) {
        rows += `<tr class="hover">
            <td class="font-semibold text-base-content">
                ${request.requestNumber}
            </td>
            <td class="w-auto max-w-[200px] min-w-[150px] break-all">
                ${request.subject}
            </td>
            <td>
                ${request.status ? request.status : "Pending"}
            </td>
        </tr>`;

        counter += 1;
    }

    correctionRequestTableBody.innerHTML = rows;

}

window.createChart = function(lastThreeMonthsLogins) {
    let canvas = document.getElementById("myChart");
    canvas.classList.replace('hidden', 'block')
    let valueLastThreeMonths = lastThreeMonthsLogins;

    let graphLoadingScreen = document.querySelector('.graph > .graph-loading-screen');
    if(graphLoadingScreen) {
        graphLoadingScreen.remove();
    }
    
    window.getMonths = function () {
        const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        let currentMonthIndex = new Date().getMonth();
        return [months[(currentMonthIndex + 10) % 12], months[(currentMonthIndex + 11) % 12], months[currentMonthIndex]];
    }

    

    // Ensure Chart.js instance doesn't already exist
    if (window.chartInstance) {
        window.chartInstance.destroy();
    }

    let ctx = canvas.getContext("2d");

    let theme = document.documentElement.getAttribute('data-theme');
    let themeColors = theme === 'sunset' ? window.themePallete.dark : window.themePallete.light;

    // Create new chart instance
    window.chartInstance = new Chart(ctx, {
        type: "bar",
        data: {
            labels: getMonths(),
            datasets: [{
                label: "Total Computer Usage per Month",
                data: valueLastThreeMonths,
                backgroundColor: [themeColors.accent, themeColors.secondary, themeColors.primary]
            }]
        },
        options: {
            plugins: {
                legend: {
                    labels: {
                        boxWidth: 0,
                        color: themeColors.primary
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: themeColors.baseContent },
                    title: { display: true, color: themeColors.accent, text: "Months" },
                },
                y: {
                    ticks: { color: themeColors.baseContent },
                    title: { display: true, color: themeColors.accent, text: "No. of Usage" },
                }
            },
            maintainAspectRatio: false,
            responsive: true
        }
    });
};



updateCourseFieldInPersonalInfo()





const studentID = window.userData.studentID; 


const socket = io({ 
    query: { studentID } 
});


socket.on("newLog", (logData) => {

    updateTotalLoginsStatCard(logData.loginThisWeek, logData.loginLastWeek);
    updateRecentUsedPCInfoCard(logData.lastPcUsed, logData.lastUsedDate);
    updateTable(logData.allLogs)
    window.createChart(logData.lastThreeMonthsLogins);
    window.lastThreeMonthsLogins = logData.lastThreeMonthsLogins;

    
    
});

socket.on('newRequest', (requestData) => {
    updatePendingRequestInfoCard(requestData.numberOfRequest);
    updateCorrectionRequesTable(requestData.requests)
})
// Handle connection errors
socket.on("connect_error", (err) => {
    console.error("Connection failed:", err.message);
});