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



/* window.renderChart({
    elementId: 'dailyUsageChart',
    type: 'bar',
    labels: ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th'], // Example dates
    data: [15, 30, 25, 40, 55, 60, 45], // Example session data
    chartLabel: 'Sessions per Day',
    chartTitle: 'Daily Computer Usage',
    tickColor: '#fff',
    titleColor: '#fff',
    xAxisText: 'Days',
    yAxisText: 'Number of Sessions',
    backgroundColors: [
      highContrastPalette.sky500, // Different colors for bar charts
      highContrastPalette.rose600,
      highContrastPalette.amber500
    ]
  });
  
  window.renderChart({
    elementId: 'monthlyUsageChart',
    type: 'line',
    labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Example months
    data: [300, 500, 450, 600, 700, 800], // Example session data
    chartLabel: 'Sessions per Month',
    chartTitle: 'Monthly Usage Trends',
    tickColor: '#fff',
    titleColor: '#fff',
    xAxisText: 'Months',
    yAxisText: 'Sessions',
    backgroundColors: [], // No background color for line chart
  });
  
  window.renderChart({
    elementId: 'courseUsageChart',
    type: 'bar',
    labels: ['Math', 'Science', 'Computer Science', 'History'], // Example courses
    data: [120, 80, 150, 90], // Example course usage data
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
  
  window.renderChart({
    elementId: 'yearLevelUsageChart',
    type: 'pie',
    labels: ['1st Year', '2nd Year', '3rd Year', '4th Year'], // Example year levels
    data: [200, 350, 400, 150], // Example data for each year level
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
    elementId: 'sectionUsageChart',
    type: 'bar',
    labels: ['Section A', 'Section B', 'Section C'], // Example sections
    data: [50, 70, 100], // Example section usage data
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
    elementId: 'correctionRequestsChart',
    type: 'line',
    labels: ['January', 'February', 'March', 'April', 'May', 'June'], // Example months
    data: [10, 15, 20, 25, 30, 35], // Example correction requests data
    chartLabel: 'Correction Requests per Month',
    chartTitle: 'Correction Requests Over Time',
    tickColor: '#fff',
    titleColor: '#fff',
    xAxisText: 'Months',
    yAxisText: 'Requests',
    backgroundColors: [], // No background color for line chart
  }); */
  
function updateNoOfRegistered(number) {
  let noOfRegistered = document.querySelector('.card-num-reg');

  noOfRegistered.innerText = number;
}


function updateNoOfRequest(number){
  let noOfRequest = document.querySelector('.card-num-req');

  noOfRequest.innerText = number;
}

function updateNoOfSection(number){
  let noOfSection= document.querySelector('.card-num-sec');

  noOfSection.innerText = number;
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
    console.log(logData.convertedData)
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
      type: 'bar',
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      data: logData.perMonthUsageVal,
      chartLabel: 'Sessions per Month',
      chartTitle: 'Monthly Usage Trends',
      tickColor: '#fff',
      titleColor: '#fff',
      xAxisText: 'Sessions', // ❗ switched X and Y since it's horizontal
      yAxisText: 'Months',
      backgroundColors: highContrastPalette.orange600, // this now controls bar color
      options: {
          indexAxis: 'y' // ❗ make the bar chart horizontal
      }
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

    console.log(corrRequests)
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

      updateNoOfRequest(corrRequests.noOfReq)
})