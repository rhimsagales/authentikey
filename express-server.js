const mongoFunctions = require('./src/js/mongo-firebase-functions')
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const http = require("http");
const socketIo = require("socket.io");
const session = require("express-session");
const MongoStore = require('connect-mongo');



const { chromium } = require('playwright');
const qr = require("qr-image");
const server = http.createServer(app);
const MainIo = socketIo(server, {
    cors: {
      origin: "*", // Allow all origins (change this in production)
    },
});
const studentIo = MainIo.of("/websocket/student")
const adminIo = MainIo.of("/websocket/admin");

const { getDatabase } = require("./firebase-config");

const db = getDatabase()




function getLastThreeMonthsLogins(data) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const lastThreeMonths = [];
    for (let i = 2; i >= 0; i--) {
        let year = now.getFullYear();
        let month = now.getMonth() - i;

        if (month < 0) {
            year--;
            month += 12;
        }

        lastThreeMonths.push({ year, month });
    }

    return lastThreeMonths.map(({ year, month }, i) => {
        const filteredEntries = data.filter(entry => {
            const entryDate = new Date(entry.date);
            const entryMonth = entryDate.getMonth();
            const entryYear = entryDate.getFullYear();

            return entryMonth === month && entryYear === year;
        });

        return filteredEntries.length;
    });
}



function getLoginsThisWeek(logs) {
    if (logs.length === 0) return 0;

    // Create date object in local timezone (system default)
    const now = new Date();
    // Set time to midnight (00:00:00.000)
    now.setHours(0, 0, 0, 0);

    // Get current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = now.getDay();
    // Calculate days since Monday (if Sunday, return 6, else return day - 1)
    const daysSinceMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

    // Create start of week date (Monday)
    const startOfWeek = new Date(now);
    // Move date back to Monday
    startOfWeek.setDate(now.getDate() - daysSinceMonday);
    // Set to start of day
    startOfWeek.setHours(0, 0, 0, 0);

    // Create end of week date (Sunday)
    const endOfWeek = new Date(startOfWeek);
    // Add 6 days to get to Sunday
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    // Set to end of day
    endOfWeek.setHours(23, 59, 59, 999);

    return logs.filter(log => {
        let logDate;
        // Parse the log date string to Date object
        if (typeof log.date === 'string' && log.date.endsWith('Z')) {
            logDate = new Date(log.date);
        } else if (typeof log.date === 'string') {
            logDate = new Date(log.date);
        } else {
            logDate = new Date(log.date);
        }
        // Apply timezone offset (this step is redundant since dates are already in local time)
        logDate = new Date(logDate.getTime() + (logDate.getTimezoneOffset() * 60000));
        return logDate >= startOfWeek && logDate <= endOfWeek;
    }).length;
}

function getLoginsLastWeek(logs) {
    if (logs.length === 0) return 0;

    // Create date object in local timezone (system default)
    const now = new Date();
    // Set time to midnight (00:00:00.000)
    now.setHours(0, 0, 0, 0);

    // Get current day (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
    const dayOfWeek = now.getDay();
    // Calculate days since Monday (if Sunday, return 6, else return day - 1)
    const daysSinceMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

    // Create start of this week date (Monday)
    const startOfThisWeek = new Date(now);
    // Move date back to Monday
    startOfThisWeek.setDate(now.getDate() - daysSinceMonday);
    // Set to start of day
    startOfThisWeek.setHours(0, 0, 0, 0);

    // Create start of last week date
    const startOfLastWeek = new Date(startOfThisWeek);
    // Move back 7 days to previous Monday
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // Create end of last week date (Sunday 23:59:59.999)
    const endOfLastWeek = new Date(startOfThisWeek);
    // Set to 1 millisecond before current week starts
    endOfLastWeek.setMilliseconds(-1);

    return logs.filter(log => {
        let logDate;
        // Parse the log date string to Date object
        if (typeof log.date === 'string' && log.date.endsWith('Z')) {
            logDate = new Date(log.date);
        } else if (typeof log.date === 'string') {
            logDate = new Date(log.date);
        } else {
            logDate = new Date(log.date);
        }
        // Apply timezone offset (this step is redundant since dates are already in local time)
        logDate = new Date(logDate.getTime() + (logDate.getTimezoneOffset() * 60000));
        return logDate >= startOfLastWeek && logDate < startOfThisWeek;
    }).length;
}






function calculatePercentageChange(logs) {
    if (logs.length === 0) return "No Records Found.";

    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const startOfThisWeek = new Date(now);
    const dayOfWeek = now.getDay();
    const daysSinceMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
    startOfThisWeek.setDate(now.getDate() - daysSinceMonday);
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setMilliseconds(-1);

    const loginsThisWeek = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startOfThisWeek;
    }).length;

    const loginsLastWeek = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startOfLastWeek && logDate < startOfThisWeek;
    }).length;

    const change = loginsThisWeek - loginsLastWeek;
    const percentageChange = loginsLastWeek > 0 ? (change / loginsLastWeek) * 100 : 100;

    return percentageChange.toFixed(2);
}



function getLastPCUsed(logs) {
    if (!logs.length) return ["N/A", "N/A"];

    // Sort logs by date (newest to oldest)
    const sortedLogs = [...logs].sort((a, b) => {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        return dateB - dateA;
    });

    // Group logs by same date while preserving their time information for later comparison
    const groupedLogs = [];
    let currentDateGroup = [];

    for (let i = 0; i < sortedLogs.length; i++) {
        const log = sortedLogs[i];
        const logDate = new Date(log.date).toDateString();

        if (currentDateGroup.length === 0 || new Date(currentDateGroup[0].date).toDateString() === logDate) {
            currentDateGroup.push(log);
        } else {
            groupedLogs.push(currentDateGroup);
            currentDateGroup = [log];
        }
    }

    if (currentDateGroup.length) groupedLogs.push(currentDateGroup);

    // Find the most recent log (using full date and time) from the latest day's group
    const latestLog = groupedLogs[0].reduce((max, log) => {
        const dateLog = new Date(log.date);
        const dateMax = new Date(max.date);
        return dateLog > dateMax ? log : max;
    });

    // Get the date parts directly and adjust for timezone
    const date = new Date(latestLog.date);
    date.setTime(date.getTime() + (date.getTimezoneOffset() * 60000));
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const formattedDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

    return [latestLog.pcNumber, formattedDate];
}


function countPendingRequest(data) {
    let counter = 0;
    for(const req of data) {
        if(req.status == "Pending") {
            counter++
        }
    }
    return counter
}



function sortLogsByDate(logs) {
    const currentYear = new Date().getFullYear();
  
    const filteredLogs = logs.filter(log => {
        const logYear = new Date(log.date).getFullYear();
        return logYear === currentYear;
    });
  
    return filteredLogs.sort((a, b) => {
      return new Date(b.date) - new Date(a.date); // Sort by date, newest first
    });
}


function isAuthenticated(req, res, next) {
    if (req.session.user) return next();
    res.status(401).json({ error: "Unauthorized" });
}

function isValidKey(req, res, next) {
    if(req.body.password != process.env.MongoPushPass) {
        return res.status(400).json({
            message : "Wrong Password"
        })
    }
    return next();
}

function convertObjectToArray(obj) {
    let result = [];
    
    for (let key in obj) {
        if (obj.hasOwnProperty(key) && typeof obj[key] === 'object') {
            result.push(obj[key]);
        }
    }
    
    return result;
}

function convertDatesInArray(array) {
    return array.map(obj => ({
        ...obj,
        date: new Date(obj.date) // Convert date string to Date object
    }));
}

function convertDateForAllLogs(data, timeZoneOffset = 0) {
    // Ensure data is an object (it should be a dictionary with student IDs as keys)
    if (typeof data !== 'object' || data === null || Object.keys(data).length === 0) {
        console.error("Input is not an object.");
        return;
    }

    // Iterate through each student in the data
    Object.keys(data).forEach(studentID => {
        const studentLogs = data[studentID];
        
        // Iterate through each log for the student
        Object.keys(studentLogs).forEach(logID => {
            const log = studentLogs[logID];
            
            // If there's a 'date' field, convert it to a Date object
            if (log.date) {
                const logDate = new Date(log.date);
                
                if (isNaN(logDate.getTime())) {
                    console.error(`Failed to parse date for logID ${logID}: ${log.date}`);
                } else {
                    // Adjust the date to the local timezone (or specify your desired timezone offset)
                    logDate.setMinutes(logDate.getMinutes() + logDate.getTimezoneOffset() + timeZoneOffset * 60);
                    log.date = logDate;  // Assign the Date object back to the 'date' field
                }
            }
        });
    });

    return data;  // Return the modified data object
}

function convertDateForAllLogsForCorrReq(data, timeZoneOffset = 8) { // Default is UTC+8
    // Ensure data is an object and not empty
    if (typeof data !== 'object' || data === null || Object.keys(data).length === 0) {
        return;
    }

    // Iterate through each student in the data
    Object.keys(data).forEach(studentID => {
        const studentLogs = data[studentID];

        // Check if studentLogs is a valid object before proceeding
        if (typeof studentLogs === 'object' && studentLogs !== null) {
            // Iterate through each log for the student
            Object.keys(studentLogs).forEach(logID => {
                const log = studentLogs[logID];

                // If there's a 'timestamp' field, convert it to a Date object
                if (log && log.timestamp) {
                    const logTimestamp = new Date(log.timestamp);

                    if (!isNaN(logTimestamp.getTime())) {
                        // Adjust the timestamp to the specified time zone offset (in minutes)
                        logTimestamp.setMinutes(logTimestamp.getMinutes() + logTimestamp.getTimezoneOffset() + (timeZoneOffset * 60));
                        log.timestamp = logTimestamp; // Assign the Date object back to the 'timestamp' field
                    }
                }
            });
        } else {
            console.warn(`No valid logs found for student ID: ${studentID}. Skipping.`);
        }
    });

    return data; // Return the modified data object
}





function getTotalLogsForThisWeek(data) {
    if (typeof data !== 'object' || data === null || Object.keys(data).length === 0) {
        console.error("Input is not an object.");
        return;
    }

    const now = new Date();
    const offset = 8 * 60 * 60 * 1000; // UTC+8 offset in milliseconds
    const nowUTC8 = new Date(now.getTime() + offset);

    let dayUTC8 = nowUTC8.getUTCDay();
    const startOfWeekUTC8 = new Date(nowUTC8);

    if (dayUTC8 === 0) {
        startOfWeekUTC8.setUTCDate(nowUTC8.getUTCDate() - 6);
    } else {
        startOfWeekUTC8.setUTCDate(nowUTC8.getUTCDate() - (dayUTC8 - 1));
    }
    startOfWeekUTC8.setUTCHours(0, 0, 0, 0);

    const endOfWeekUTC8 = new Date(startOfWeekUTC8);
    endOfWeekUTC8.setUTCDate(startOfWeekUTC8.getUTCDate() + 6);
    endOfWeekUTC8.setUTCHours(23, 59, 59, 999);

    const weeklyLogs = [0, 0, 0, 0, 0, 0, 0];

    Object.keys(data).forEach(studentID => {
        const studentLogs = data[studentID];

        Object.keys(studentLogs).forEach(logID => {
            const log = studentLogs[logID];

            if (!log.date) {
                console.warn(`Missing date in log ${logID} for student ${studentID}`);
                return;
            }

            const logDate = new Date(log.date);

            if (isNaN(logDate.getTime())) {
                console.error(`Invalid date in log ${logID}:`, log.date);
                return;
            }

            const startOfWeekUTC8Adjusted = new Date(startOfWeekUTC8.getTime() + offset);
            const endOfWeekUTC8Adjusted = new Date(endOfWeekUTC8.getTime() + offset);

            if (logDate >= startOfWeekUTC8Adjusted && logDate <= endOfWeekUTC8Adjusted) {
                const logDateUTC = new Date(logDate.getTime() - offset);
                let logDayUTC = logDateUTC.getUTCDay();
                const adjustedLogDayIndex = (logDayUTC === 0) ? 6 : logDayUTC - 1;
                weeklyLogs[adjustedLogDayIndex]++;
            }
        });
    });

    return weeklyLogs;
}


















function getTotalLogsPerMonthThisYear(dataObject) {
    if (typeof dataObject !== 'object' || !dataObject || dataObject === null || Object.keys(dataObject).length === 0) {
        console.log("Input is not an object. Returning default zero-filled array.");
        return Array(12).fill(0);
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const monthlyTotals = Array(12).fill(0);

    // Iterate over each student (dataObject is keyed by studentID)
    Object.values(dataObject).forEach((studentLogs) => {
        Object.values(studentLogs).forEach((log) => {
            if (!log.date) {
                return;
            }

            // Assuming log.date is already a Date object
            const logDate = log.date instanceof Date ? log.date : new Date(log.date);

            if (isNaN(logDate.getTime())) {
                return;
            }

            const year = logDate.getFullYear();
            const month = logDate.getMonth();

            if (year === currentYear) {
                monthlyTotals[month]++;
            }
        });
    });

    return monthlyTotals;
}


function getTopSectionsByLogins(dataObject) {
    if (typeof dataObject !== 'object' || !dataObject || dataObject === null || Object.keys(dataObject).length === 0) {
        console.log("Input is not an object. Returning default values.");
        return { sections: [], logins: [] };
    }

    const sectionLogins = {};

    // Iterate over each student (dataObject is keyed by studentID)
    Object.values(dataObject).forEach((studentLogs) => {
        Object.values(studentLogs).forEach((log) => {
            if (!log.section || !log.date) {
                return;
            }

            // Increment login count for the section
            if (!sectionLogins[log.section]) {
                sectionLogins[log.section] = 0;
            }
            sectionLogins[log.section]++;
        });
    });

    // Convert the sectionLogins object to an array and sort by logins
    const sortedSections = Object.entries(sectionLogins)
        .sort((a, b) => b[1] - a[1]) // Sort by total logins in descending order
        .slice(0, 3); // Get top 3

    // Extract section names and total logins
    const topSections = sortedSections.map(item => item[0]);
    const topLogins = sortedSections.map(item => item[1]);

    return {
        sections: topSections,
        logins: topLogins
    };
}


function getTotalCorrectionRequestsPerMonthThisYear(dataObject) {
    if (typeof dataObject !== 'object' || !dataObject || dataObject === null || Object.keys(dataObject).length === 0) {
        return Array(12).fill(0);
    }

    const now = new Date();
    const currentYear = now.getFullYear();
    const monthlyTotals = Array(12).fill(0); // Initialize array for each month

    // Iterate over each student (dataObject is keyed by studentID)
    Object.values(dataObject).forEach((studentLogs) => {
        Object.values(studentLogs).forEach((log) => {
            if (!log.timestamp) {
                return; // Skip if there's no timestamp
            }

            // Use timestamp field and convert it to a Date object
            const timestamp = log.timestamp;
            const correctionRequestDate = new Date(timestamp);
            if (isNaN(correctionRequestDate.getTime())) {
                return; // Skip if the timestamp is invalid
            }

            const year = correctionRequestDate.getFullYear();
            const month = correctionRequestDate.getMonth();

            if (year === currentYear) {
                monthlyTotals[month]++; // Increment the count for the correct month
            }
        });
    });

    return monthlyTotals;
}

function getNewestPendingUniqueRequestsAsObject(dataObject) {
    const newestPendingRequestsObject = {};
  
    // Create an array of all pending requests with their unique IDs
    const allPendingRequestsArray = [];
    for (const studentID in dataObject) {
        if (dataObject.hasOwnProperty(studentID)) {
            const studentRequests = dataObject[studentID];
            for (const requestId in studentRequests) {
                if (studentRequests.hasOwnProperty(requestId)) {
                    const request = studentRequests[requestId];
                    if (request.status === 'Pending' && request.timestamp) {
                        allPendingRequestsArray.push({ id: requestId, ...request });
                    }
                }
            }
        }
    }

    // Sort the array of pending requests from newest to oldest
    allPendingRequestsArray.sort((a, b) => a.timestamp - b.timestamp);

    // Convert the sorted array back into an object with unique request IDs as keys
    allPendingRequestsArray.forEach(requestWithId => {
        newestPendingRequestsObject[requestWithId.id] = { ...requestWithId };
        delete newestPendingRequestsObject[requestWithId.id].id; // Remove the temporary 'id' property
    });

    return newestPendingRequestsObject;
}

function getApprovedUniqueRequestsAsObject(dataObject) {
    const approvedRequestsObject = {};
  
    // Create an array of all approved requests with their unique IDs
    const allApprovedRequestsArray = [];
    for (const studentID in dataObject) {
        if (dataObject.hasOwnProperty(studentID)) {
            const studentRequests = dataObject[studentID];
            for (const requestId in studentRequests) {
            if (studentRequests.hasOwnProperty(requestId)) {
                const request = studentRequests[requestId];
                // Check if the request status is 'Approved'
                if (request.status === 'Approved' && request.timestamp) {
                allApprovedRequestsArray.push({ id: requestId, ...request });
                }
            }
            }
        }
    }

    // Sort the array of approved requests from newest to oldest
    allApprovedRequestsArray.sort((a, b) => b.timestamp - a.timestamp);

    // Convert the sorted array back into an object with unique request IDs as keys
    allApprovedRequestsArray.forEach(requestWithId => {
        approvedRequestsObject[requestWithId.id] = { ...requestWithId };
        delete approvedRequestsObject[requestWithId.id].id; // Remove the temporary 'id' property
    });

    return approvedRequestsObject;
}

function getRejectedUniqueRequestsAsObject(dataObject) {
    const rejectedRequestsObject = {};

    // Create an array of all rejected requests with their unique IDs
    const allRejectedRequestsArray = [];
    for (const studentID in dataObject) {
        if (dataObject.hasOwnProperty(studentID)) {
            const studentRequests = dataObject[studentID];
            for (const requestId in studentRequests) {
            if (studentRequests.hasOwnProperty(requestId)) {
                const request = studentRequests[requestId];
                // Check if the request status is 'Rejected'
                if (request.status === 'Rejected' && request.timestamp) {
                allRejectedRequestsArray.push({ id: requestId, ...request });
                }
            }
            }
        }
    }

    // Sort the array of rejected requests from newest to oldest
    allRejectedRequestsArray.sort((a, b) => b.timestamp - a.timestamp);

    // Convert the sorted array back into an object with unique request IDs as keys
    allRejectedRequestsArray.forEach(requestWithId => {
        rejectedRequestsObject[requestWithId.id] = { ...requestWithId };
        delete rejectedRequestsObject[requestWithId.id].id; // Remove the temporary 'id' property
    });

    return rejectedRequestsObject;
}




function getTotalLogsPerYearLevel(dataObject) {
    if (typeof dataObject !== 'object' || !dataObject || dataObject === null || Object.keys(dataObject).length === 0) {
        return {
            '1st Year': 0,
            '2nd Year': 0,
            '3rd Year': 0,
            '4th Year': 0
        };
    }

    const yearLevelTotals = {
        '1st Year': 0,
        '2nd Year': 0,
        '3rd Year': 0,
        '4th Year': 0
    };

    Object.values(dataObject).forEach((studentLogs) => {
        Object.values(studentLogs).forEach((log) => {
            const yearLevel = log.yearLevel;
            if (yearLevelTotals.hasOwnProperty(yearLevel)) {
                yearLevelTotals[yearLevel]++;
            }
        });
    });

    return yearLevelTotals;
}


function getTopFourCoursesByUsage(dataObject) {
    if (typeof dataObject !== 'object' || !dataObject || dataObject === null || Object.keys(dataObject).length === 0) {
        return [];
    }

    const courseCounts = {};

    // Iterate over each student
    Object.values(dataObject).forEach(studentLogs => {
        Object.values(studentLogs).forEach(log => {
            if (log.course) {
                const course = log.course;
                courseCounts[course] = (courseCounts[course] || 0) + 1;
            }
        });
    });

    // Convert to an array and sort by count descending
    const sortedCourses = Object.entries(courseCounts)
        .sort((a, b) => b[1] - a[1]) // Sort by count (bigger first)
        .slice(0, 4); // Take only top 4

    // Optional: Map it nicely if you want just labels and values
    const result = sortedCourses.map(([course, count]) => ({
        course,
        count
    }));

    return result;
}




function countNumberOfRequest(dataObject) {
    let counter = 0;
    for(const studentID in dataObject) {
        counter += Object.keys(dataObject[studentID]).length;
    }
    return counter;
}


function countSections(dataObject) {
    let uniqueSections = new Set();
    let sections = [];

    for(const studentId in dataObject){
        for(const record in dataObject[studentId]){
            uniqueSections.add(dataObject[studentId][record].section);
        }
    }
    // console.log(sections)
    return uniqueSections.size
}


function findMostUsedPC(computerUsageLogs) {
    if (!computerUsageLogs) {
        return null; // Handle the case where there's no data.
    }

    const pcCounts = {}; // Object to store the count of each PC.

    // Iterate through each student's logs.
    for (const studentId in computerUsageLogs) {
        const studentLogs = computerUsageLogs[studentId];
        if(studentLogs){
           for (const logId in studentLogs) {
              const log = studentLogs[logId];
              if (log && log.pcNumber) { // Check if log and pcNumber exist
                    const pcNumber = log.pcNumber;
                    pcCounts[pcNumber] = (pcCounts[pcNumber] || 0) + 1;
                }
           }
        }
    }

    let mostUsedPC = null;
    let maxCount = 0;

    // Find the PC with the highest count.
    for (const pcNumber in pcCounts) {
        if (pcCounts[pcNumber] > maxCount) {
            maxCount = pcCounts[pcNumber];
            mostUsedPC = pcNumber;
        }
    }

    return mostUsedPC;
}


function findPeakHour(computerUsageLogs) {
    if (!computerUsageLogs) {
        return null; // Handle the case where there's no data.
    }

    const intervalCounts = {}; // Object to store the count of each interval.

    // Iterate through each student's logs.
    for (const studentId in computerUsageLogs) {
        const studentLogs = computerUsageLogs[studentId];
        if (studentLogs) {
            for (const logId in studentLogs) {
                const log = studentLogs[logId];
                if (log && log.timeIn) { // Check if log and timeIn exist
                    const timeIn = log.timeIn;
                    intervalCounts[timeIn] = (intervalCounts[timeIn] || 0) + 1;
                }
            }
        }
    }

    let peakInterval = null;
    let maxCount = 0;

    // Find the hour with the highest count.
    for (const interval in intervalCounts) {
        if (intervalCounts[interval] > maxCount) {
            maxCount = intervalCounts[interval];
            peakInterval = interval;
        }
    }

     // Log the usage of each hour.
    // console.log("Hourly Usage Counts:");
    // for (const interval in intervalCounts) {
    //     console.log(`  ${interval}: ${intervalCounts[interval]} times`);
    // }
    return peakInterval;
}

app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(
    session({
        secret: process.env.SessionSecret, 
        resave: false,
        saveUninitialized: false,
        cookie: { 
            maxAge: 1000 * 60 * 60 * 24,
            secure: false,
            httpOnly: true

        },
        store: MongoStore.create({ mongoUrl: process.env.MongoURI })
    })
);



app.use((req, res, next) => {
    if (req.path.endsWith('.html') || req.path.endsWith('.ejs')) {
        return res.status(403).send('Access Denied');
    }
    next(); 
});


app.use(express.static(path.join(__dirname, 'src')));
app.set("views", path.join(__dirname, "src", "views"));



mongoFunctions.connectToMongoDB();

studentIo.on("connection", (socket) => {
    const studentID = socket.handshake.query.studentID;

    if (!studentID) {
        console.log("User ID missing!");
        return socket.disconnect();
    }

    const studentComputerLogsRef = db.ref(`studentsRecord/logs/${studentID}`);
    const studentCorrectionRequestRef = db.ref(`studentsRecord/correctionRequest/${studentID}`);

    
    studentComputerLogsRef.on("value", (snapshot) => {
        

        const data = snapshot.val();
        const dataArray = data ? Object.values(data) : [];
        
        const convertedDataArray = convertDatesInArray(dataArray);
        
        
        const lastUsedPcDate = getLastPCUsed(convertedDataArray);
        socket.emit("newLog", {
            loginLastWeek: getLoginsLastWeek(convertedDataArray),
            loginThisWeek: getLoginsThisWeek(convertedDataArray),
            lastPcUsed: lastUsedPcDate[0],
            lastUsedDate: lastUsedPcDate[1],
            lastThreeMonthsLogins: getLastThreeMonthsLogins(convertedDataArray),
            allLogs: sortLogsByDate(convertedDataArray),
            
        });
        
        
        
    
    });


    studentCorrectionRequestRef.on("value", (snapshot) => {
        const data = snapshot.val();
        const dataArray = data ? Object.values(data) : [];


        

        
        
        socket.emit('newRequest', {
            numberOfRequest : countPendingRequest(dataArray),
            requests : dataArray
        })
    })
    // Disconnect event
    socket.on("disconnect", () => {
        studentComputerLogsRef.off(); 
        studentCorrectionRequestRef.off();
        
    });
});

adminIo.on("connection", (socket) => {
    const computerLogsRef = db.ref(`studentsRecord/logs/`);
    const correctionRequestRef = db.ref(`studentsRecord/correctionRequest/`);


    computerLogsRef.on('value', (snapshot)=> {
        const data = snapshot.val();
        const convertedData = convertDateForAllLogs(data);

        const dailyUsageVal = getTotalLogsForThisWeek(convertedData);
        const perMonthUsageVal = getTotalLogsPerMonthThisYear(convertedData);
        const usagePerSection = getTopSectionsByLogins(convertedData);
        const usagePerYear = getTotalLogsPerYearLevel(convertedData);
        const usagePerCourse = getTopFourCoursesByUsage(convertedData);
        const noOfRegistered = snapshot.numChildren() > 0? snapshot.numChildren() : 0;
        const noSection = countSections(convertedData) > 0 ? countSections(convertedData) :0;
        const mostUsedPc = findMostUsedPC(convertedData) !== null ? findMostUsedPC(convertedData) : "N/A";
        const peakHour = findPeakHour(convertedData) !== null ? findPeakHour(convertedData) : "N/A";
        // console.log(peakHour)
        
        
        
        
        
        

        socket.emit("newLogAdded", {dailyUsageVal, perMonthUsageVal, usagePerSection, usagePerYear, usagePerCourse, noOfRegistered, noSection, mostUsedPc, peakHour})
    });

    correctionRequestRef.on("value", (snapshot) => {
        const data = snapshot.val();
        const convertedData = convertDateForAllLogsForCorrReq(data);
        

        const totalCorrReqPerMonth = getTotalCorrectionRequestsPerMonthThisYear(convertedData);
        const noOfReq = countNumberOfRequest(convertedData) > 0? countNumberOfRequest(convertedData) : 0;
        // console.log(noOfReq)
        const cloneConvertedData = convertedData;

        const pendingRequest = getNewestPendingUniqueRequestsAsObject(cloneConvertedData);

        const approvedRequest = getApprovedUniqueRequestsAsObject(cloneConvertedData);
        const rejectedRequest = getRejectedUniqueRequestsAsObject(cloneConvertedData)
        // console.log(pendingRequest)
        

        socket.emit("newRequest", {totalCorrReqPerMonth, noOfReq, pendingRequest, rejectedRequest, approvedRequest})
    })

    
    // Disconnect event
    socket.on("disconnect", () => {
        computerLogsRef.off(); 
        correctionRequestRef.off();
        
    });
})







app.get('/user/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).end();
        }

        res.clearCookie("connect.sid");
        res.redirect("/pages/sign-in"); 
    });
});



app.get('/', (req, res) => {
    res.send('Server is online.');
});

app.get('/pages/:name', (req, res) => {
    const pageName = req.params.name; 

    if(pageName == "sign-in" || pageName == "sign-up") {
        if (req.session.studentID) {
            
            
            return res.redirect("/users/student-dashboard");
        }
        
    }
    
    res.sendFile(path.join(__dirname, `src/pages/${pageName}.html`));
});

app.get('/users/student-dashboard', async (req, res) => {
    

    try {
        if (!req.session) {
            return res.redirect("/pages/sign-in");
        }

        

        if (!req.session.studentID) {
            return res.redirect("/pages/sign-in");
        }

        if (!req.session.user) {
            return res.redirect("/pages/sign-in");
        }

        
        await mongoFunctions.getAllLogs(req, res, req.session.studentID);
        const userData = {
            name: req.session.user.name,
            studentID: req.session.user.studentID,
            section: req.session.user.section,
            email: req.session.user.email,
            course: req.session.user.course,
            yearLevel: req.session.user.yearLevel,
            campus: req.session.user.campus,
            
        };

        

        res.render('student-dashboard-copy', userData);

    } catch (err) {
        console.error('[student-dashboard] Caught error:', err);
        return res.redirect("/pages/sign-in");
    }
});


app.post('/pages/sign-up/check-studentid-availability', async (req, res) => {
    mongoFunctions.checkStudentIdAvailability(req, res);
});

app.post('/pages/sign-up/register-account', async (req, res) => {
    mongoFunctions.registerAccount(req, res);
});

app.post('/pages/sign-in/login', async(req, res) => {
    mongoFunctions.login(req, res);
})

app.post('/pages/sign-in/login/send-code', async (req, res) => {
    mongoFunctions.createResetPassDoc(req, res);
    
})

app.delete('/pages/sign-in/login/delete-code', async(req, res) => {
    mongoFunctions.deleteResetPassDocs(req, res);
})
app.post('/pages/sign-in/login/verify-code', async(req, res) => {
    mongoFunctions.compareResetCode(req, res);
})

app.post('/pages/sign-in/login/change-password', async(req, res) => {
    mongoFunctions.changePassword(req, res);
})

app.get('/pages/sign-in/change-pass/send/secret', (req, res) => {
    
    const secrets = {
        serviceID : process.env.EmailJsService,
        templateID : process.env.EmailJsTemplate,
        publicID : process.env.EmailJsPublic,
    }
    res.json(secrets);
})

app.post('/send-correction-request', isAuthenticated,(req, res) => {
    
    mongoFunctions.insertCorrectionRequest(req, res);
})


app.get('/check-session', (req, res) => {
    if (!req.session || !req.session.studentID) {
        return res.json({ loggedIn: false });
    }
    res.json({ loggedIn: true, studentID: req.session.studentID });
});


app.post('/user/update-personal-info', isAuthenticated, (req, res) => {
    mongoFunctions.updatePersonalInfo(req, res);
})


app.post('/user/change-password', isAuthenticated, (req, res) => {
    mongoFunctions.updatePassword(req, res);
})

app.post('/user/delete-student', isAuthenticated, (req, res) => {
    mongoFunctions.deleteStudent(req, res);
})


app.post('/secret/connection-string', (req, res) => {
    res.status(200).json({
        connectionString : process.env.MongoURI
    })
});


app.post('/firebase/push-log', isValidKey, (req, res) => {
    
    mongoFunctions.findAndPushData(req, res);
});

app.post('/firebase/get-filtered-logs', (req, res) => {
    mongoFunctions.getFilteredLogs(req, res);
});

app.post('/generate-pdf', isAuthenticated, async (req, res) => {
    const { html } = req.body;
    if (!html) {
        return res.status(400).json({ error: 'HTML content is required' });
    }
    
    let browser;
   
    try {
        browser = await chromium.launch();
        const page = await browser.newPage();

        await page.setContent(html, { waitUntil: 'domcontentloaded' });
        await page.waitForSelector('.qr-code > svg', { visible: true });

        // Ensure all images are fully loaded
        await page.evaluate(async () => {
            const images = Array.from(document.images);
            await Promise.all(images.map(img => 
                img.complete ? Promise.resolve() : new Promise(resolve => img.onload = resolve)
            ));
        });

        const pdfBuffer = await page.pdf({ 
            format: 'Letter', 
            printBackground: true 
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="document.pdf"');
        res.send(pdfBuffer);
    } catch (error) {
        console.error("PDF generation failed:", error);
        res.status(500).json({ error: "Internal Server Error" });
    } finally {
        if (browser) {
            await browser.close();
        }
    }
});


app.post('/generate-qr', isAuthenticated, (req, res) => {
    const { text } = req.body;
    
    if (!text) {
        return res.status(400).json({ error: 'Text is required' });
    }

    const qrSVG = qr.imageSync(text, { type: 'svg' }); 
    res.json({ svg: qrSVG }); 
});


app.post('/mongodb/find-student-id', isAuthenticated, (req, res) => {
    
    mongoFunctions.findStudentID(req, res);
});


app.post('/admin/edit-logs', (req, res) => {
    mongoFunctions.adminApproveModifyLogs(req, res);
})

app.post('/admin/reject-request', (req, res) => {
    mongoFunctions.adminRejectModifyLogs(req, res);
})


server.listen(process.env.PORT || 3000, () => {
    console.log('Server running at http://localhost:3000');
});