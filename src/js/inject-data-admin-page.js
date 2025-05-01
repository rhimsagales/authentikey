import { createWarningAlert, createErrorAlert, createSuccessAlert } from './alert.js';


const highContrastPalette = {
    blue700: '#4f46e5',        // bg-blue-700 (Primary background)
    rose600: '#e11d48',        // bg-rose-600 (Secondary background)
    amber500: '#f59e0b',       // bg-amber-500 (Accent background)
    emerald500: '#10b981',     // bg-emerald-500 (Success background)
    orange600: '#f97316',      // bg-orange-600 (Warning background)
    sky500: '#3b82f6',         // bg-sky-500 (Info background)
    red500: '#ef4444',         // bg-red-500 (Danger background)
    gray800: '#1f2937',        // bg-gray-800 (Card background)
    gray100: '#f5f5f5',        // bg-gray-100 (Light text background)
    gray900: '#111827',        // bg-gray-900 (General background)
    purple500: '#a855f7',      // bg-purple-500 (Highlight background)
    gray500: '#6b7280',        // bg-gray-500 (Muted background)
    gray400: '#9ca3af'         // bg-gray-400 (Disabled background)
};


window.renderChart = function({
    elementId,
    type = 'line',
    labels = [],
    data = [],
    chartLabel = '',
    chartTitle = '',
    tickColor = '#fff', // default white
    titleColor = '#fff', // default white
    xAxisText = 'X Axis',
    yAxisText = 'Y Axis',
    backgroundColors = [], // No default colors
    lineColor = 'rgba(75, 192, 192, 1)',
    options = {}
}) {
    // Remove loading screen if it exists
    let graphLoadingScreen = document.querySelector('.graph > .graph-loading-screen');
    if (graphLoadingScreen) {
        graphLoadingScreen.remove();
    }

    // Destroy the existing chart instance for the specific elementId if it exists
    if (window.chartInstances && window.chartInstances[elementId]) {
        window.chartInstances[elementId].destroy();
    }

    // Get the context of the canvas element
    const ctx = document.getElementById(elementId).getContext('2d');

    // Define whether scales should be shown (except for 'pie' and 'doughnut')
    const showScales = !['pie', 'doughnut'].includes(type);

    // Create a new chart instance for the specific elementId
    const chartInstance = new Chart(ctx, {
        type,
        data: {
            labels,
            datasets: [{
            label: chartLabel,
            data,
            borderColor: lineColor,
            backgroundColor: backgroundColors, // Apply the background colors
            tension: type === 'line' ? 0.8 : 0
            }]
        },
        options: {
            maintainAspectRatio: true, // Ensures that the aspect ratio is not maintained
            responsive: true, // Ensures that the chart is responsive
            plugins: {
            legend: {
                display: true,
                position: 'top',
                labels: {
                color: tickColor // legend text color
                }
            },
            title: {
                display: !!chartTitle,
                text: chartTitle,
                color: titleColor
            }
            },
            scales: showScales ? {
            x: {
                ticks: {
                color: tickColor
                },
                title: {
                display: true,
                text: xAxisText,
                color: titleColor
                }
            },
            y: {
                ticks: {
                color: tickColor
                },
                title: {
                display: true,
                text: yAxisText,
                color: titleColor
                },
                beginAtZero: true
            }
            } : {},
            ...options // Custom options passed in the function call
        }
    });

    // Store the chart instance in a global object with the elementId as the key
    if (!window.chartInstances) {
        window.chartInstances = {};
    }
    window.chartInstances[elementId] = chartInstance; 
};



function toISOStringWithoutSeconds(timestamp) {
  const date = new Date(timestamp);
  const offsetMilliseconds = 8 * 60 * 60 * 1000; // 8 hours in milliseconds
  const adjustedDate = new Date(date.getTime() + offsetMilliseconds);
  const isoString = adjustedDate.toISOString();
  return isoString.slice(0, 16); // Extract YYYY-MM-DDTHH:mm
}



function createRequestCardWithIds(count, request, requestID) {
  const requestCard = document.createElement('div');
  requestCard.className = 'request-card';

  const studentIdSpan = document.createElement('span');
  studentIdSpan.className = 'font-semibold';
  studentIdSpan.innerHTML = `
    Student ID:
    <span class="font-normal">&nbsp;${request.studentID}</span>
  `;
  requestCard.appendChild(studentIdSpan);

  const detailsRow1 = document.createElement('div');
  detailsRow1.className = 'w-full flex flex-wrap items-center justify-between gap-3 font-semibold';
  detailsRow1.innerHTML = `
    <span>
      Subject:
      <span class="font-normal">&nbsp;${request.subject}</span>
    </span>
    <span class="text-gray-500">
      Date Submitted:
      <span class="font-normal">&nbsp;${toISOStringWithoutSeconds(request.timestamp)}</span>
    </span>
  `;
  requestCard.appendChild(detailsRow1);

  const detailsRow2 = document.createElement('div');
  detailsRow2.className = 'w-full flex flex-wrap items-center justify-between gap-3 font-semibold';
  detailsRow2.innerHTML = `
    <span class="">
      Name:
      <span class="font-normal">${request.fullName}</span>
    </span>
    <span>
      Date of Concern:
      <span class="font-normal text-sky-300">${request.dateRecord}</span>
    </span>
  `;
  requestCard.appendChild(detailsRow2);

  const viewButtonContainer = document.createElement('div');
  viewButtonContainer.className = 'w-full flex items-center justify-end';
  const viewButton = document.createElement('button');
  viewButton.className = 'cr-show-modal-btns btn btn-sm btn-primary rounded-full md:w-32 text-xs md:text-sm';
  viewButton.setAttribute('popovertarget', `cr-modal${count}`);
  viewButton.setAttribute('popovertargetaction', 'show');
  viewButton.textContent = 'View Request';
  viewButtonContainer.appendChild(viewButton);
  requestCard.appendChild(viewButtonContainer);

  const modalDiv = document.createElement('div');
  modalDiv.className = 'request-modal';
  modalDiv.setAttribute('popover', 'auto');
  modalDiv.id = `cr-modal${count}`;

  const modalContentDiv = document.createElement('div');
  modalContentDiv.className = 'request-modal-content';

  const closeButton = document.createElement('button');
  closeButton.className = 'request-modal-close-button cr-hide-modal-btns';
  closeButton.setAttribute('popovertargetaction', 'hide');
  closeButton.setAttribute('popovertarget', `cr-modal${count}`);
  closeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `;
  modalContentDiv.appendChild(closeButton);

  const modalHeaderDiv = document.createElement('div');
  modalHeaderDiv.className = 'request-modal-header';
  modalHeaderDiv.innerHTML = `
    <h1 class="request-modal-header-title">Subject:<span class="font-normal text-white">&nbsp;${request.subject}</span></h1>
    <div class="request-modal-header-details">
      <span class="request-modal-details-group"><span>Student ID:&nbsp;</span> <span class="request-modal-details-value">${request.studentID}</span></span>
      <span class="request-modal-details-group"><span class="text-right">Date of Concern:</span> <span class="request-modal-details-value text-sky-300 text-right" >&nbsp;${request.dateRecord}</span></span>
    </div>
    <div class="request-modal-concern-details">
      <span class="request-modal-concern-label">Details:</span>
      <div class="request-modal-concern-text-container">
        <pre><p class="request-modal-concern-text preserve-text">${request.correctionDetails}</p>
        </pre>
      </div>
    </div>
    <div class="w-full h-auto max-h-[250px] overflow-y-auto flex items-start justify-start flex-wrap gap-2 p-2">
      <div class="request-modal-input-group">
        <label for="requestID${count}" class="request-modal-input-label">Request ID:</label>
        <input type="text" class="request-modal-input" id="requestID${count}" value="${requestID}" disabled>
      </div>
      <div class="request-modal-input-group">
        <label for="recordID${count}" class="request-modal-input-label">Record ID:</label>
        <input type="text" class="request-modal-input" id="recordID${count}" value="${request.recordID}" disabled>
      </div>
      <div class="request-modal-input-group">
        <label for="studentID${count}" class="request-modal-input-label">Student ID:</label>
        <input type="text" class="request-modal-input" id="studentID${count}" value="${request.studentID}" disabled>
      </div>
      <div class="request-modal-input-group">
        <label for="dateOfConcern${count}" class="request-modal-input-label">Date of Concern:</label>
        <input type="datetime-local" class="request-modal-input" id="dateOfConcern${count}" disabled value="${request.dateRecord}">
      </div>
      <div class="request-modal-input-group">
        <label for="newDate${count}" class="request-modal-input-label">New Date:</label>
        <input type="datetime-local" class="request-modal-input" id="newDate${count}">
      </div>
      <div class="request-modal-input-group">
        <label for="newTimeIn${count}" class="request-modal-input-label">New Time-in:</label>
        <input type="text" class="request-modal-input" id="newTimeIn${count}" placeholder="08:00 PM">
      </div>
      <div class="request-modal-input-group">
        <label for="newTimeOut${count}" class="request-modal-input-label">New Time-out:</label>
        <input type="text" class="request-modal-input" id="newTimeOut${count}" placeholder="10:00 PM">
      </div>
    </div>
  `;
  modalContentDiv.appendChild(modalHeaderDiv);

  const modalActionsDiv = document.createElement('div');
  modalActionsDiv.className = 'request-modal-actions';
  modalActionsDiv.innerHTML = `
    <button class="cr-reject-btns request-modal-reject-button" >
      Reject
    </button>
    <button class="cr-approve-modify-btns request-modal-approve-button" >
      Approve & Modify
    </button>
  `;
  modalContentDiv.appendChild(modalActionsDiv);

  modalDiv.appendChild(modalContentDiv);
  requestCard.appendChild(modalDiv);

  
  document.querySelector('.cr-main-container-box').appendChild(requestCard);
  return
}

function createRejectedRequestCardWithIds(count, request) {
  const requestCard = document.createElement('div');
  requestCard.className = 'request-card';

  const studentIdSpan = document.createElement('span');
  studentIdSpan.className = 'font-semibold';
  studentIdSpan.innerHTML = `
    Student ID:
    <span class="font-normal">&nbsp;${request.studentID}</span>
  `;
  requestCard.appendChild(studentIdSpan);

  const detailsRow1 = document.createElement('div');
  detailsRow1.className = 'w-full flex flex-wrap items-center justify-between gap-3 font-semibold';
  detailsRow1.innerHTML = `
    <span>
      Subject:
      <span class="font-normal">&nbsp;${request.subject}</span>
    </span>
    <span class="text-gray-500">
      Date Submitted:
      <span class="font-normal">&nbsp;${toISOStringWithoutSeconds(request.timestamp)}</span>
    </span>
  `;
  requestCard.appendChild(detailsRow1);

  const detailsRow2 = document.createElement('div');
  detailsRow2.className = 'w-full flex flex-wrap items-center justify-between gap-3 font-semibold';
  detailsRow2.innerHTML = `
    <span class="">
      Name:
      <span class="font-normal">${request.fullName}</span>
    </span>
    <span>
      Date of Concern:
      <span class="font-normal text-sky-300">${request.dateRecord}</span>
    </span>
  `;
  requestCard.appendChild(detailsRow2);

  const viewButtonContainer = document.createElement('div');
  viewButtonContainer.className = 'w-full flex items-center justify-end';
  const viewButton = document.createElement('button');
  viewButton.className = 'cr-show-modal-btns btn btn-sm btn-primary rounded-full md:w-32 text-xs md:text-sm';
  viewButton.setAttribute('popovertarget', `cr-modal${count}`);
  viewButton.setAttribute('popovertargetaction', 'show');
  viewButton.textContent = 'View Request';
  viewButtonContainer.appendChild(viewButton);
  requestCard.appendChild(viewButtonContainer);

  const modalDiv = document.createElement('div');
  modalDiv.className = 'request-modal';
  modalDiv.setAttribute('popover', 'auto');
  modalDiv.id = `cr-modal${count}`;

  const modalContentDiv = document.createElement('div');
  modalContentDiv.className = 'request-modal-content min-h-0';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'request-modal-close-button cr-hide-modal-btns';
  closeButton.setAttribute('popovertargetaction', 'hide');
  closeButton.setAttribute('popovertarget', `cr-modal${count}`);
  closeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `;
  modalContentDiv.appendChild(closeButton);

  const modalHeaderDiv = document.createElement('div');
  modalHeaderDiv.className = 'request-modal-header';
  modalHeaderDiv.innerHTML = `
    <h1 class="request-modal-header-title">Subject:<span class="font-normal text-white">&nbsp;${request.subject}</span></h1>
    <div class="request-modal-header-details">
      <span class="request-modal-details-group"><span>Student ID:&nbsp;</span> <span class="request-modal-details-value">${request.studentID}</span></span>
      <span class="request-modal-details-group"><span class="text-right">Date of Concern:</span> <span class="request-modal-details-value text-sky-300 text-right" >&nbsp;${request.dateRecord}</span></span>
    </div>
    <div class="request-modal-concern-details">
      <span class="request-modal-concern-label">Details:</span>
      <div class="request-modal-concern-text-container">
        <pre><p class="request-modal-concern-text preserve-text">${request.correctionDetails}</p>
        </pre>
      </div>
    </div>
  `;
  modalContentDiv.appendChild(modalHeaderDiv);


  modalDiv.appendChild(modalContentDiv);
  requestCard.appendChild(modalDiv);

  document.querySelector('.cr-rejected-box').appendChild(requestCard);
  return;
}
function createApprovedRequestCardWithIds(count, request) {
  const requestCard = document.createElement('div');
  requestCard.className = 'request-card';

  const studentIdSpan = document.createElement('span');
  studentIdSpan.className = 'font-semibold';
  studentIdSpan.innerHTML = `
    Student ID:
    <span class="font-normal">&nbsp;${request.studentID}</span>
  `;
  requestCard.appendChild(studentIdSpan);

  const detailsRow1 = document.createElement('div');
  detailsRow1.className = 'w-full flex flex-wrap items-center justify-between gap-3 font-semibold';
  detailsRow1.innerHTML = `
    <span>
      Subject:
      <span class="font-normal">&nbsp;${request.subject}</span>
    </span>
    <span class="text-gray-500">
      Date Submitted:
      <span class="font-normal">&nbsp;${toISOStringWithoutSeconds(request.timestamp)}</span>
    </span>
  `;
  requestCard.appendChild(detailsRow1);

  const detailsRow2 = document.createElement('div');
  detailsRow2.className = 'w-full flex flex-wrap items-center justify-between gap-3 font-semibold';
  detailsRow2.innerHTML = `
    <span class="">
      Name:
      <span class="font-normal">${request.fullName}</span>
    </span>
    <span>
      Date of Concern:
      <span class="font-normal text-sky-300">${request.dateRecord}</span>
    </span>
  `;
  requestCard.appendChild(detailsRow2);

  const viewButtonContainer = document.createElement('div');
  viewButtonContainer.className = 'w-full flex items-center justify-end';
  const viewButton = document.createElement('button');
  viewButton.className = 'cr-show-modal-btns btn btn-sm btn-primary rounded-full md:w-32 text-xs md:text-sm';
  viewButton.setAttribute('popovertarget', `cr-modal${count}`);
  viewButton.setAttribute('popovertargetaction', 'show');
  viewButton.textContent = 'View Request';
  viewButtonContainer.appendChild(viewButton);
  requestCard.appendChild(viewButtonContainer);

  const modalDiv = document.createElement('div');
  modalDiv.className = 'request-modal';
  modalDiv.setAttribute('popover', 'auto');
  modalDiv.id = `cr-modal${count}`;

  const modalContentDiv = document.createElement('div');
  modalContentDiv.className = 'request-modal-content min-h-0';
  
  const closeButton = document.createElement('button');
  closeButton.className = 'request-modal-close-button cr-hide-modal-btns';
  closeButton.setAttribute('popovertargetaction', 'hide');
  closeButton.setAttribute('popovertarget', `cr-modal${count}`);
  closeButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" class="size-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    </svg>
  `;
  modalContentDiv.appendChild(closeButton);

  const modalHeaderDiv = document.createElement('div');
  modalHeaderDiv.className = 'request-modal-header';
  modalHeaderDiv.innerHTML = `
    <h1 class="request-modal-header-title">Subject:<span class="font-normal text-white">&nbsp;${request.subject}</span></h1>
    <div class="request-modal-header-details">
      <span class="request-modal-details-group"><span>Student ID:&nbsp;</span> <span class="request-modal-details-value">${request.studentID}</span></span>
      <span class="request-modal-details-group"><span class="text-right">Date of Concern:</span> <span class="request-modal-details-value text-sky-300 text-right" >&nbsp;${request.dateRecord}</span></span>
    </div>
    <div class="request-modal-concern-details">
      <span class="request-modal-concern-label">Details:</span>
      <div class="request-modal-concern-text-container">
        <pre><p class="request-modal-concern-text preserve-text">${request.correctionDetails}</p>
        </pre>
      </div>
    </div>
  `;
  modalContentDiv.appendChild(modalHeaderDiv);

  

  modalDiv.appendChild(modalContentDiv);
  requestCard.appendChild(modalDiv);

  document.querySelector('.cr-approved-box').appendChild(requestCard);
  return;
}


// createRequestCardWithIds(1, sampleRequest, sampleRequestID)

function attachEventListeners() {
  const crApproveModifyBtns = document.querySelectorAll('.cr-approve-modify-btns');
  const crRejectBtns = document.querySelectorAll('.cr-reject-btns');

  // Helper function to remove all event listeners from an element
  function removeAllEventListeners(element) {
      const clone = element.cloneNode(true);
      element.parentNode.replaceChild(clone, element);
      return clone;
  }

  // Remove existing event listeners and reattach them for approve/modify buttons
  crApproveModifyBtns.forEach(btn => {
      const cleanBtn = removeAllEventListeners(btn);
      cleanBtn.addEventListener('click', async (e) => {
          e.preventDefault();

          const modal = e.target.closest('.request-modal-content');
          const requestCard = e.target.closest('.request-card');
          const requestModal = e.target.closest('.request-modal');
          const inputs = modal.querySelectorAll('input');

          if (!inputs[0].value || !inputs[1].value || !inputs[2].value || !inputs[3].value || !inputs[4].value || !inputs[5].value) {
              createWarningAlert("All fields are required.");
              return;
          }

          const newData = JSON.stringify({
              requestID: inputs[0].value,
              recordID: inputs[1].value,
              studentID: inputs[2].value,
              dateOfConcern: inputs[3].value,
              newDate: inputs[4].value,
              newTimeIn: inputs[5].value,
              newTimeOut: inputs[6].value
          });

          try {
              const response = await fetch('/admin/edit-logs', {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: newData
              });
              const responseData = await response.json();
              if (!response.ok) {
                  createWarningAlert(responseData.message);
              } else {
                  requestModal.hidePopover();
                  createSuccessAlert(responseData.message);
                  
              }
          } catch (err) {
              createErrorAlert("Unfortunately, we were unable to fully process your request due to some issues.");
          }
      });
  });

  // Remove existing event listeners and reattach them for reject buttons
  crRejectBtns.forEach(btn => {
      const cleanBtn = removeAllEventListeners(btn);
      cleanBtn.addEventListener('click', async (e) => {
          e.preventDefault();

          const modal = e.target.closest('.request-modal-content');
          const requestCard = e.target.closest('.request-card');
          const requestModal = e.target.closest('.request-modal');
          
          
          const inputs = modal.querySelectorAll('input');

          const newData = JSON.stringify({
              studentID: inputs[2].value,
              requestID: inputs[0].value
          });

          if (!inputs[0].value || !inputs[2].value) {
              createWarningAlert("All fields are required.");
              return;
          }

          try {
              const response = await fetch('/admin/reject-request', {
                  method: 'POST',
                  headers: {
                      "Content-Type": "application/json"
                  },
                  body: newData
              });

              const responseData = await response.json();
              if (!response.ok) {
                  createWarningAlert(responseData.message);
              } else {
                  requestModal.hidePopover();
                  createSuccessAlert(responseData.message);
                  
                  
              }
          } catch (err) {
              createErrorAlert("Unfortunately, we were unable to fully process your request due to some issues.");
          }
      });
  });
}


let count = 1; // Counter for unique modal IDs
function iterateThroughReq(dataObject) {
  document.querySelector('.cr-main-container-box').innerHTML = "";
  
  for (const requestID in dataObject) {
    if (dataObject.hasOwnProperty(requestID)) {
      const req = dataObject[requestID]; // Access the request object
      createRequestCardWithIds(count, req, requestID); // Pass the request object and requestID
      count++;
    }
  }


  
  // Call the function to attach event listeners
  attachEventListeners();



}

function iterateThroughRejReq(dataObject) {
  document.querySelector('.cr-rejected-box').innerHTML = "";
  

  for (const reqKey in dataObject) {
    if (dataObject.hasOwnProperty(reqKey)) { // Important: Check for own properties
      const request = dataObject[reqKey]; // Get the value (the request object)
      createRejectedRequestCardWithIds(count, request); // Pass the value and the key (requestID)
      count++; // Increment count for each request
    }
  }
}

function iterateThroughAppReq(dataObject) {
  document.querySelector('.cr-approved-box').innerHTML = "";
  

  for (const reqKey in dataObject) {
    if (dataObject.hasOwnProperty(reqKey)) { // Important: Check for own properties
      const request = dataObject[reqKey]; // Get the value (the request object)
      createApprovedRequestCardWithIds(count, request); // Pass the value and the key (requestID)
      count++; // Increment count for each request
    }
  }
}
// Example of how to append the created element to the document body:
// document.body.appendChild(createRequestCardWithIds());

// document.querySelector('.cr-main-container-box').appendChild(createRequestCard())

// Example of how to append the created element to the document body:
// document.body.appendChild(createRequestCard());

  
function updateNoOfRegistered(number) {
  let noOfRegistered = document.querySelector('.card-num-reg');
  console.log(typeof number);

  let count = 0;
  const interval = setInterval(() => {
    noOfRegistered.innerText = count; // Update the display

    if (count >= number) {
      clearInterval(interval); // Stop when count reaches number
    }
    count++;
  }, 100); // Execute every 500ms
}


function updateNoOfRequest(number){
  let noOfRequest = document.querySelector('.card-num-req');

  
  let count = 0;
  const interval = setInterval(() => {
    noOfRequest.innerText = count; // Update the display

    if (count >= number) {
      clearInterval(interval); // Stop when count reaches number
    }
    count++;
  }, 100);
}

function updateNoOfSection(number){
  let noOfSection= document.querySelector('.card-num-sec');

  
  let count = 0;
  const interval = setInterval(() => {
    noOfSection.innerText = count; // Update the display

    if (count >= number) {
      clearInterval(interval); // Stop when count reaches number
    }
    count++;
  }, 100);
}

function updateMostUsedPc(pcNumber){
  let mostUsedPc= document.querySelector('.card-most-pc');

  mostUsedPc.innerText = `PC-${pcNumber}`;
}

function updatePeakHour(peakHour) {
  let peakHourElem = document.querySelector('.card-peak-hour');

  peakHourElem.innerText = peakHour;
}

const socketAdmin = io("/websocket/admin");


socketAdmin.on("newLogAdded", (logData) => {
    // console.log(logData)
    // console.log(logData.dailyUsageVal);
    // console.log(logData.perMonthUsageVal);
    // console.log(logData.convertedData)
    window.renderChart({
        elementId: 'dailyUsageChart',
        type: 'bar',
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Example dates
        data: logData.dailyUsageVal, // Example session data
        chartLabel: 'Sessions per Day',
        chartTitle: 'Daily Computer Usage',
        tickColor: '#fff',
        titleColor: '#fff',
        xAxisText: 'Days',
        yAxisText: 'Number of Sessions',
        backgroundColors: [highContrastPalette.amber500, highContrastPalette.emerald500, highContrastPalette.orange600, highContrastPalette.red500, highContrastPalette.gray800, highContrastPalette.sky500, highContrastPalette.blue700],
        lineColor : highContrastPalette.sky500
    });


    window.renderChart({
      elementId: 'monthlyUsageChart',
      type: 'line',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: logData.perMonthUsageVal,
      chartLabel: 'Sessions per Month',
      chartTitle: 'Monthly Usage Trends',
      tickColor: '#fff',
      titleColor: '#fff',
      xAxisText: 'Sessions', // ❗ switched X and Y since it's horizontal
      yAxisText: 'Months',
      backgroundColors: highContrastPalette.orange600, // this now controls bar color
      
  });
  


    window.renderChart({
        elementId: 'sectionUsageChart',
        type: 'pie',
        labels: logData.usagePerSection.sections, // Example sections
        data: logData.usagePerSection.logins, // Example section usage data
        chartLabel: 'Logs by Section',
        chartTitle: 'Student Usage by Section',
        tickColor: '#fff',
        titleColor: '#fff',
        xAxisText: 'Sections',
        yAxisText: 'Number of Logs',
        backgroundColors: [
          highContrastPalette.red500,
          highContrastPalette.amber500,
          highContrastPalette.purple500
        ]
      });

      window.renderChart({
        elementId: 'yearLevelUsageChart',
        type: 'doughnut',
        labels: ['1st Year', '2nd Year', '3rd Year', '4th Year'], // Example year levels
        data: [logData.usagePerYear['1st Year'], logData.usagePerYear['2nd Year'], logData.usagePerYear['3rd Year'], logData.usagePerYear['4th Year']], // Example data for each year level
        chartLabel: 'Total Logs by Year Level',
        chartTitle: 'Usage by Year Level',
        tickColor: '#fff',
        titleColor: '#fff',
        xAxisText: '', // Pie charts do not need x-axis text
        yAxisText: '', // Pie charts do not need y-axis text
        backgroundColors: [
          highContrastPalette.blue700,
          highContrastPalette.sky500,
          highContrastPalette.rose600,
          highContrastPalette.amber500
        ]
      });

      
      window.renderChart({
        elementId: 'courseUsageChart',
        type: 'bar',
        labels: logData.usagePerCourse.map(item => item.course),
        data: logData.usagePerCourse.map(item => item.count),
        chartLabel: 'Logs per Course',
        chartTitle: 'Usage by Course',
        tickColor: '#fff',
        titleColor: '#fff',
        xAxisText: 'Courses',
        yAxisText: 'Number of Logs',
        backgroundColors: [
          highContrastPalette.purple500,
          highContrastPalette.orange600,
          highContrastPalette.emerald500
        ]
      });


      updateNoOfRegistered(logData.noOfRegistered);
      updateNoOfSection(logData.noSection);
      updateMostUsedPc(logData.mostUsedPc);
      updatePeakHour(logData.peakHour)
});


socketAdmin.on("newRequest", (corrRequests) => {

    count = 1;
    window.renderChart({
        elementId: 'correctionRequestsChart',
        type: 'line',
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'], // Example months
        data: corrRequests.totalCorrReqPerMonth, // Example correction requests data
        chartLabel: 'Correction Requests per Month',
        chartTitle: 'Correction Requests Over Time',
        tickColor: '#fff',
        titleColor: '#fff',
        xAxisText: 'Months',
        yAxisText: 'Requests',
        backgroundColors: highContrastPalette.purple500, // No background color for line chart
        lineColor: highContrastPalette.purple500
      });

      updateNoOfRequest(corrRequests.noOfReq);
      iterateThroughReq(corrRequests.pendingRequest);
      console.log(corrRequests.approvedRequest);
      console.log(corrRequests.rejectedRequest);
      iterateThroughRejReq(corrRequests.rejectedRequest);
      iterateThroughAppReq(corrRequests.approvedRequest);
      
})


socketAdmin.on("statusModified", (corrRequests) => {
  console.log(corrRequests)
})