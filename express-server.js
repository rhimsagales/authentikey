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
const io = socketIo(server, {
    cors: {
      origin: "*", // Allow all origins (change this in production)
    },
});
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






function sortLogsByDate(logs) {
    return logs.sort((a, b) => {
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

io.on("connection", (socket) => {
    const studentID = socket.handshake.query.studentID;

    if (!studentID) {
        console.log("User ID missing!");
        return socket.disconnect();
    }

    const studentComputerLogsRef = db.ref(`studentsRecord/logs/${studentID}`);
    const studentCorrectionRequestRef = db.ref(`studentsRecord/correctionRequest/${studentID}`)

    // 🔹 Remove any previous listener before adding a new one
    studentComputerLogsRef.off("child_added");
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
            numberOfRequest : dataArray.length,
            requests : dataArray
        })
    })
    // Disconnect event
    socket.on("disconnect", () => {
        studentComputerLogsRef.off(); 
        studentCorrectionRequestRef.off();
        
    });
});









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
            course: req.session.user.course,
            yearLevel : req.session.user.yearLevel,
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
        
        res.render('student-dashboard-copy', userData);
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

app.post('/firebase/get-filtered-logs', isAuthenticated, (req, res) => {
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




server.listen(process.env.PORT || 3000, () => {
    console.log('Server running at http://localhost:3000');
});