const mongoFunctions = require('./src/js/mongo-functions')
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const session = require("express-session");
const MongoStore = require('connect-mongo');

const { chromium } = require('playwright');
const qr = require("qr-image");

function getLastThreeMonthsLogins(data) {
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0); // Normalize to start of the day in UTC

    // Get last two months + current month in UTC
    const lastThreeMonths = [2, 1, 0].map(offset => {
        const date = new Date(now);
        date.setUTCMonth(now.getUTCMonth() - offset);
        return date.getUTCMonth(); // Extract adjusted month index
    });

    return lastThreeMonths.map(monthIndex => 
        data.filter(entry => {
            const entryDateUTC = new Date(entry.date);
            return entryDateUTC.getUTCMonth() === monthIndex;
        }).length
    );
}



function getLoginsThisWeek(logs) {
    if (logs.length === 0) return 0;

    // Get current date and time in UTC
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0); // Normalize to start of the day in UTC

    // Calculate start of the current week (Monday, 12:00 AM UTC)
    const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysSinceMonday = (dayOfWeek === 0 ? 6 : dayOfWeek - 1); // Adjust to get Monday as start

    // Start of the current week (Monday, 12:00 AM UTC)
    const startOfWeekUTC = new Date(now);
    startOfWeekUTC.setUTCDate(now.getUTCDate() - daysSinceMonday);
    startOfWeekUTC.setUTCHours(0, 0, 0, 0);

    // End of the current week (Sunday, 11:59:59 PM UTC)
    const endOfWeekUTC = new Date(startOfWeekUTC);
    endOfWeekUTC.setUTCDate(startOfWeekUTC.getUTCDate() + 6);
    endOfWeekUTC.setUTCHours(23, 59, 59, 999);

    let count = 0;

    logs.forEach(log => {
        const logDateUTC = new Date(log.date);
        if (logDateUTC >= startOfWeekUTC && logDateUTC <= endOfWeekUTC) {
            count++;
        }
    });

    return count;
}



function getLoginsLastWeek(logs) {
    if (logs.length === 0) return 0;

    // ✅ Step 1: Get the current time in UTC
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0); // Normalize to start of the day in UTC

    // ✅ Step 2: Find the start of this week (Monday 00:00:00 UTC)
    const dayOfWeek = now.getUTCDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
    const daysSinceMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    const startOfThisWeekUTC = new Date(now);
    startOfThisWeekUTC.setUTCDate(now.getUTCDate() - daysSinceMonday);
    startOfThisWeekUTC.setUTCHours(0, 0, 0, 0);

    // ✅ Step 3: Get start of the previous week (7 days before the start of this week)
    const startOfLastWeekUTC = new Date(startOfThisWeekUTC);
    startOfLastWeekUTC.setUTCDate(startOfLastWeekUTC.getUTCDate() - 7);

    const endOfLastWeekUTC = new Date(startOfLastWeekUTC);
    endOfLastWeekUTC.setUTCDate(startOfLastWeekUTC.getUTCDate() + 6);
    endOfLastWeekUTC.setUTCHours(23, 59, 59, 999);

    // ✅ Step 4: Count logs within last week's range
    let count = 0;

    logs.forEach(log => {
        const logDateUTC = new Date(log.date); // Assuming log.date is in UTC

        // Check if logDateUTC is in range (startOfLastWeekUTC and endOfLastWeekUTC are now in UTC)
        if (logDateUTC >= startOfLastWeekUTC && logDateUTC <= endOfLastWeekUTC) {
            count++;
        }
    });

    return count;
}




function calculatePercentageChange(logs) {
    if (logs.length === 0) return "No Records Found.";

    // Get current date and normalize to UTC
    const now = new Date();
    now.setUTCHours(0, 0, 0, 0);

    // Get start of the current week (Sunday) in UTC
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setUTCDate(now.getUTCDate() - now.getUTCDay());
    startOfThisWeek.setUTCHours(0, 0, 0, 0);

    // Get start of the previous week (one week before) in UTC
    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setUTCDate(startOfLastWeek.getUTCDate() - 7);

    // Get end of the previous week (before this week's start) in UTC
    const endOfLastWeek = new Date(startOfThisWeek);
    endOfLastWeek.setMilliseconds(-1);

    // Count logins for this week
    const loginsThisWeek = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startOfThisWeek;
    }).length;

    // Count logins for last week
    const loginsLastWeek = logs.filter(log => {
        const logDate = new Date(log.date);
        return logDate >= startOfLastWeek && logDate < startOfThisWeek;
    }).length;

    // Calculate percentage change
    const change = loginsThisWeek - loginsLastWeek;
    const percentageChange = loginsLastWeek > 0 ? (change / loginsLastWeek) * 100 : 100;

    return percentageChange.toFixed(2);
}



function getLastPCUsed(logs) {
    if (!logs.length) return ["N/A", "N/A"];

    // Sort logs by date (newest to oldest)
    const sortedLogs = [...logs].sort((a, b) => {
        return new Date(b.date) - new Date(a.date);
    });

    // Group logs by date (ignoring time)
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

    // Find the most recent log in the latest group
    const latestLog = groupedLogs[0].reduce((max, log) => {
        return new Date(log.date) > new Date(max.date) ? log : max;
    });

    // Format the date in UTC
    const formattedDate = new Date(latestLog.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });

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


app.post('/mongodb/push-log', isValidKey, (req, res) => {
    
    mongoFunctions.findAndPushData(req, res);
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


app.listen(process.env.PORT || 3000, () => {
    console.log('Server running at http://localhost:3000');
});