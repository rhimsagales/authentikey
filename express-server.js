const mongoFunctions = require('./src/js/mongo-functions')
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const session = require("express-session");
const MongoStore = require('connect-mongo');

function getLastThreeMonthsLogins(data) {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0); // Normalize to start of the day in UTC

    // Convert to UTC+8 by adding 8 hours
    const nowUTC8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);

    // Get last two months + current month in UTC+8
    const lastThreeMonths = [2, 1, 0].map(offset => {
        const date = new Date(nowUTC8);
        date.setUTCMonth(nowUTC8.getUTCMonth() - offset);
        return date.getUTCMonth(); // Extract adjusted month index
    });

    return lastThreeMonths.map(monthIndex => 
        data.filter(entry => {
            const entryDateUTC8 = new Date(new Date(entry.date).getTime() + 8 * 60 * 60 * 1000);
            return entryDateUTC8.getUTCMonth() === monthIndex;
        }).length
    );
}



function getLoginsThisWeek(logs) {
    if (logs.length === 0) return 0;

    // Get current date and time in UTC+8 (PH Time)
    const now = new Date();
    const nowUTC8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    // console.log("Current Date (PH Time):", nowUTC8.toISOString());

    // Calculate start of the current week (Monday, 12:00 AM PH Time)
    const dayOfWeek = nowUTC8.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysSinceMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust to get Monday as start

    // Start of the current week (Monday, 12:00 AM PH Time)
    const startOfWeekUTC8 = new Date(nowUTC8);
    startOfWeekUTC8.setDate(nowUTC8.getDate() - daysSinceMonday); // Adjust to start of Monday
    startOfWeekUTC8.setHours(0, 0, 0, 0); // Set to start of day

    // End of the current week (Sunday, 11:59:59 PM PH Time)
    const endOfWeekUTC8 = new Date(startOfWeekUTC8);
    endOfWeekUTC8.setDate(startOfWeekUTC8.getDate() + 6); // Adjust to Sunday
    endOfWeekUTC8.setHours(23, 59, 59, 999); // Set to end of day

    // console.log("Start of This Week (PH Time):", startOfWeekUTC8.toISOString());
    // console.log("End of This Week (PH Time):", endOfWeekUTC8.toISOString());

    let count = 0;

    logs.forEach(log => {
        const logDateUTC = new Date(log.date);
        const logDateUTC8 = new Date(logDateUTC.getTime() + 8 * 60 * 60 * 1000); // Convert to PH Time

        const isInRange = logDateUTC8 >= startOfWeekUTC8 && logDateUTC8 <= endOfWeekUTC8;

        // console.log(`Log Date (Original UTC): ${logDateUTC.toISOString()}`);
        // console.log(`Log Date (Converted to PH Time): ${logDateUTC8.toISOString()}`);
        // console.log(`Is in range? ${isInRange}`);

        if (isInRange) count++;
    });

    // console.log(`Total logins this week: ${count}`);
    return count;
}













function getLoginsLastWeek(logs) {
    if (logs.length === 0) return 0;

    // ✅ Step 1: Get the current time in UTC+8 (PH Time)
    const now = new Date();
    const nowUTC8 = new Date(now.getTime() + 8 * 60 * 60 * 1000);
    // console.log("Current Date (UTC+8):", nowUTC8.toISOString());

    // ✅ Step 2: Find the start of this week (Monday 00:00:00 UTC+8)
    const dayOfWeek = nowUTC8.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const startOfThisWeekUTC8 = new Date(nowUTC8);
    startOfThisWeekUTC8.setDate(nowUTC8.getDate() - daysSinceMonday);
    startOfThisWeekUTC8.setHours(0, 0, 0, 0);

    // ✅ Step 3: Get start of the previous week (7 days before the start of this week)
    const startOfLastWeekUTC8 = new Date(startOfThisWeekUTC8);
    startOfLastWeekUTC8.setDate(startOfLastWeekUTC8.getDate() - 7);

    const endOfLastWeekUTC8 = new Date(startOfLastWeekUTC8);
    endOfLastWeekUTC8.setDate(startOfLastWeekUTC8.getDate() + 6);
    endOfLastWeekUTC8.setHours(23, 59, 59, 999);

    // console.log("Start of Last Week (UTC+8):", startOfLastWeekUTC8.toISOString());
    // console.log("End of Last Week (UTC+8):", endOfLastWeekUTC8.toISOString());

    // ✅ Step 4: Count logs within last week's range
    let count = 0;

    logs.forEach(log => {
        const logDateUTC = new Date(log.date); // Assuming log.date is in UTC
        const logDateUTC8 = new Date(logDateUTC.getTime() + 8 * 60 * 60 * 1000);

        // console.log(`Log Date (UTC): ${logDateUTC.toISOString()} | Log Date (UTC+8): ${logDateUTC8.toISOString()}`);

        // Check if logDateUTC+8 is in range (startOfLastWeekUTC8 and endOfLastWeekUTC8 are now in UTC+8)
        const isInRange = logDateUTC8 >= startOfLastWeekUTC8 && logDateUTC8 <= endOfLastWeekUTC8;

        // console.log(`Log Date (UTC+8) in range? ${isInRange}`);

        if (isInRange) count++;
    });

    // console.log(`Total Logs Found in Range: ${count}`);
    return count;
}

































function calculatePercentageChange(logs) {
    if (logs.length === 0) return "No Records Found.";

    // Get current date and adjust for UTC-8
    const now = new Date();
    const offset = 8 * 60; // UTC-8 offset in minutes
    const nowUTC8 = new Date(now.getTime() - offset * 60000);

    // Get start of the current week (Sunday) in UTC-8
    const startOfThisWeek = new Date(nowUTC8);
    startOfThisWeek.setDate(nowUTC8.getDate() - nowUTC8.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    // Get start of the previous week (one week before) in UTC-8
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // Get end of the previous week (before this week's start) in UTC-8
    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setMilliseconds(-1);

    // Count logins for this week
    const loginsThisWeek = logs.filter(log => {
        const logDate = new Date(log.date);
        const logDateUTC8 = new Date(logDate.getTime() - offset * 60000);
        return logDateUTC8 >= startOfThisWeek;
    }).length;

    // Count logins for last week
    const loginsLastWeek = logs.filter(log => {
        const logDate = new Date(log.date);
        const logDateUTC8 = new Date(logDate.getTime() - offset * 60000);
        return logDateUTC8 >= startOfLastWeek && logDateUTC8 < startOfThisWeek;
    }).length;

    // Calculate percentage change
    const change = loginsThisWeek - loginsLastWeek;
    const percentageChange = loginsLastWeek > 0 ? (change / loginsLastWeek) * 100 : 100;

    return percentageChange.toFixed(2);
}






function getLastPCUsed(logs) {
    if (!logs.length) return ["N/A", "N/A"]; // Return default if no logs exist

    // Convert log dates to UTC+8 for accurate comparisons (Philippines Time)
    const convertToUTC8 = (date) => {
        const adjustedDate = new Date(date);
        adjustedDate.setHours(adjustedDate.getHours() + 8); // Adjust for UTC+8 (Philippines Time)
        return adjustedDate;
    };

    // Sort logs by date (newest to oldest), using UTC+8 time
    const sortedLogs = [...logs].sort((a, b) => {
        return convertToUTC8(b.date) - convertToUTC8(a.date);
    });

    // Group logs by date (ignoring time)
    const groupedLogs = [];
    let currentDateGroup = [];

    for (let i = 0; i < sortedLogs.length; i++) {
        const log = sortedLogs[i];
        const logDate = convertToUTC8(log.date).toDateString(); // Get just the date part (ignoring time)

        if (currentDateGroup.length === 0 || convertToUTC8(currentDateGroup[0].date).toDateString() === logDate) {
            currentDateGroup.push(log); // Add to the current group
        } else {
            groupedLogs.push(currentDateGroup); // Push the previous group
            currentDateGroup = [log]; // Start a new group with the current log
        }
    }

    if (currentDateGroup.length) groupedLogs.push(currentDateGroup); // Push the last group

    // Now, for each group, find the most recent log
    const latestLog = groupedLogs[0].reduce((max, log) => {
        const currentLogTime = convertToUTC8(log.date).getTime(); // Get the timestamp of the current log
        const maxLogTime = convertToUTC8(max.date).getTime(); // Get the timestamp of the max log

        return currentLogTime > maxLogTime ? log : max; // Return the log with the latest timestamp
    });

    // Adjust formattedDate for UTC+8 and get correct formatted date string
    const formattedDate = convertToUTC8(latestLog.date);

    // Explicitly use the Philippines time zone (UTC+8) and format the adjusted date
    const adjustedFormattedDate = formattedDate.toLocaleDateString("en-US", {
        timeZone: "Asia/Manila", // Use Philippines time zone (UTC+8)
        month: "short",
        day: "numeric",
        year: "numeric"
    });

    return [latestLog.pcNumber, adjustedFormattedDate];
}



function sortLogsByDate(logs) {
    return logs.sort((a, b) => {
        return new Date(b.date) - new Date(a.date); // Sort by date, newest first
    });
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
            secure: false,
            httpOnly: true

        },
        store: MongoStore.create({ mongoUrl: process.env.MongoURI })
    })
);

app.use((req, res, next) => {
    if (req.path.endsWith('.html')) {
        return res.status(403).send('Access Denied');
    }
    next(); 
});
app.use(express.static(path.join(__dirname, 'src')));
app.set("views", path.join(__dirname, "src", "views"));



mongoFunctions.connectToMongoDB();




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
    // console.log(getLoginsThisWeek(req.session.user.logs))

    try {
        
        if (!req.session || !req.session.studentID) {
            
            
            return res.redirect("/pages/sign-in");
        }
        
        await mongoFunctions.getAllLogs(req, res, req.session.studentID);
        

        const lastUsedPcDate = getLastPCUsed(req.session.user.logs);
        
        const userData = {
            name: req.session.user.name,
            studentID: req.session.user.studentID,
            section: req.session.user.section,
            email: req.session.user.email,
            loginLastWeek: getLoginsLastWeek(req.session.user.logs),
            loginThisWeek: getLoginsThisWeek(req.session.user.logs),
            percentageChange: calculatePercentageChange(req.session.user.logs),
            lastPcUsed: lastUsedPcDate[0],
            lastUsedDate: lastUsedPcDate[1],
            correctionRequestCount: req.session.user.correctionRequest.length,
            lastThreeMonthsLogins: getLastThreeMonthsLogins(req.session.user.logs),
            allLogs: sortLogsByDate(req.session.user.logs),
            allCorrectionRequest : req.session.user.correctionRequest
            
        };

        // console.log(req.session.user.logs)
        
        res.render('student-dashboard', userData);
    } catch (err) {
        return res.redirect("/pages/sign-in");
    }
    
})

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

app.post('/send-correction-request', (req, res) => {
    
    mongoFunctions.insertCorrectionRequest(req, res);
})


app.get('/check-session', (req, res) => {
    if (!req.session || !req.session.studentID) {
        return res.json({ loggedIn: false });
    }
    res.json({ loggedIn: true, studentID: req.session.studentID });
});


app.post('/user/update-personal-info', (req, res) => {
    mongoFunctions.updatePersonalInfo(req, res);
})


app.post('/user/change-password', (req, res) => {
    mongoFunctions.updatePassword(req, res);
})

app.post('/user/delete-student', (req, res) => {
    mongoFunctions.deleteStudent(req, res);
})


app.post('/secret/connection-string', (req, res) => {
    res.status(200).json({
        connectionString : process.env.MongoURI
    })
});


app.post('/mongodb/push-log', (req, res) => {
    
    mongoFunctions.findAndPushData(req, res);
})

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
