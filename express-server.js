const mongoFunctions = require('./src/js/mongo-functions')
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const session = require("express-session");
const MongoStore = require('connect-mongo');

function getLastThreeMonthsLogins(data) {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const currentMonth = new Date().getMonth(); // 0-based index
    const lastThreeMonths = [
        (currentMonth + 10) % 12, 
        (currentMonth + 11) % 12, 
        currentMonth
    ];

    return lastThreeMonths.map(monthIndex => 
        data.filter(entry => new Date(entry.date).getMonth() === monthIndex).length
    );
}

function getLoginsThisWeek(logs) {
    if (logs.length === 0) return 0;

    const now = new Date();
    now.setUTCHours(now.getUTCHours() + 8); // Adjust to Philippines time (UTC+8)
    console.log("Current Date (PH Time):", now.toISOString());

    const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysSinceMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust to get Monday as start

    // Start of the current week (Monday, 12:00 AM PH Time)
    const startOfWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - daysSinceMonday));
    startOfWeek.setUTCHours(0 - 8, 0, 0, 0); // Convert back to UTC

    // End of the current week (Sunday, 11:59:59 PM PH Time)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setUTCDate(startOfWeek.getUTCDate() + 6);
    endOfWeek.setUTCHours(23 - 8, 59, 59, 999); // Convert back to UTC

    console.log("Start of This Week (PH Time converted to UTC):", startOfWeek.toISOString());
    console.log("End of This Week (PH Time converted to UTC):", endOfWeek.toISOString());

    return logs.filter(log => {
        const logDate = new Date(log.date);
        const isInRange = logDate >= startOfWeek && logDate <= endOfWeek;
        // console.log(`Log Date: ${logDate.toISOString()} | In range? ${isInRange}`);
        return isInRange;
    }).length;
}








function getLoginsLastWeek(logs) {
    if (logs.length === 0) return 0;

    // ✅ Step 1: Get the current time in PH Time (UTC+8)
    const now = new Date();
    const nowPH = new Date(now.getTime() + (8 * 60 * 60 * 1000)); // Convert to PH Time

    console.log("Current Date (PH Time):", nowPH.toISOString());

    // ✅ Step 2: Find the start of the current week (Monday 00:00:00 PH Time)
    const dayOfWeek = nowPH.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysSinceMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1);

    const startOfThisWeekPH = new Date(Date.UTC(
        nowPH.getUTCFullYear(),
        nowPH.getUTCMonth(),
        nowPH.getUTCDate() - daysSinceMonday
    ));
    startOfThisWeekPH.setUTCHours(0, 0, 0, 0); // Set to start of day (PH Time)

    // ✅ Step 3: Get start and end of last week (PH Time)
    const startOfLastWeekPH = new Date(startOfThisWeekPH);
    startOfLastWeekPH.setUTCDate(startOfThisWeekPH.getUTCDate() - 7);
    startOfLastWeekPH.setUTCHours(0, 0, 0, 0);

    const endOfLastWeekPH = new Date(startOfLastWeekPH);
    endOfLastWeekPH.setUTCDate(startOfLastWeekPH.getUTCDate() + 6);
    endOfLastWeekPH.setUTCHours(23, 59, 59, 999);

    console.log("Start of Last Week (PH Time):", startOfLastWeekPH.toISOString());
    console.log("End of Last Week (PH Time):", endOfLastWeekPH.toISOString());

    // ✅ Step 4: Count logs within last week's range (Comparing in PH Time)
    let count = 0;

    logs.forEach(log => {
        const logDateUTC = new Date(log.date);
        const logDatePH = new Date(logDateUTC.getTime() + (8 * 60 * 60 * 1000)); // Convert to PH Time
        const isInRange = logDatePH >= startOfLastWeekPH && logDatePH <= endOfLastWeekPH;

        console.log(`Log Date (PH Time): ${logDatePH.toISOString()} | In range? ${isInRange}`);

        if (isInRange) count++;
    });

    console.log(`Total Logs Found in Range: ${count}`);
    return count;
}



























function calculatePercentageChange(logs) {
    if (logs.length === 0) return "No Records Found.";
    const now = new Date();

    // Get start of the current week (Sunday)
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay());
    startOfThisWeek.setHours(0, 0, 0, 0);

    // Get start of the previous week (one week before)
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7);

    // Get end of the previous week (before this week's start)
    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setMilliseconds(-1);

    // Count logins for this week
    const loginsThisWeek = logs.filter(log => new Date(log.date) >= startOfThisWeek).length;

    // Count logins for last week
    const loginsLastWeek = logs.filter(log => new Date(log.date) >= startOfLastWeek && new Date(log.date) < startOfThisWeek).length;

    // Calculate percentage change
    const change = loginsThisWeek - loginsLastWeek;
    const percentageChange = loginsLastWeek > 0 ? (change / loginsLastWeek) * 100 : 100;

    return percentageChange.toFixed(2);
}

function getLastPCUsed(logs) {
    if (!logs.length) return ["N/A", "N/A"]; // Return default if no logs exist

    // Create a copy with correct property names
    const logsCopy = logs.map(log => ({
        date: new Date(log.date), // Convert date to Date object
        timeIn: log.timeIn, 
        timeOut: log.timeOut,
        pcNumber: log.pcNumber,
        fullDate: null
    }));

    // Convert timeOut into a valid Date object
    logsCopy.forEach(log => {
        if (!log.timeOut) return; // Skip if timeOut is missing

        const dateObj = new Date(log.date);
        const [time, period] = log.timeOut.split(" "); // Extract time and AM/PM
        let [hours, minutes] = time.split(":").map(Number);

        // Convert 12-hour format to 24-hour format
        if (period === "PM" && hours !== 12) hours += 12;
        if (period === "AM" && hours === 12) hours = 0;

        // Set correct time to date
        dateObj.setUTCHours(hours, minutes, 0, 0);
        log.fullDate = dateObj;
    });

    // Filter out invalid logs
    const validLogs = logsCopy.filter(log => log.fullDate && !isNaN(log.fullDate));

    if (!validLogs.length) return ["N/A", "N/A"];

    // Find the log with the latest fullDate
    const lastUsedLog = validLogs.reduce((max, log) => 
        log.fullDate > max.fullDate ? log : max, 
        validLogs[0]
    );

    // Fix date formatting to prevent timezone shifts
    const formattedDate = lastUsedLog.fullDate.toUTCString().split(" ").slice(1, 4).join(" "); // Outputs "Feb 24 2025"

    return [lastUsedLog.pcNumber, formattedDate];
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

        res.clearCookie("connect.sid"); // Clear session cookie
        res.redirect("/pages/sign-in"); // Redirect to sign-in page
    });
});



app.get('/', (req, res) => {
    res.send('Server is online.');
});

app.get('/pages/:name', (req, res) => {
    const pageName = req.params.name; 

    
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
            allLogs: req.session.user.logs,
            allCorrectionRequest : req.session.user.correctionRequest
            
        };

         
        
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
