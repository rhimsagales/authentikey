const mongoFunctions = require('./src/js/mongo-functions')
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const app = express();
const session = require("express-session");

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
    if (logs.length === 0) return "0";
    const now = new Date();
    const startOfWeek = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - now.getUTCDay()));
    
    return logs.filter(log => new Date(log.date) >= startOfWeek).length;
}



function getLoginsLastWeek(logs) {
    if (logs.length === 0) return "0";
    const now = new Date();
    const startOfThisWeek = new Date(now);
    startOfThisWeek.setDate(now.getDate() - now.getDay()); // Sunday of this week
    startOfThisWeek.setHours(0, 0, 0, 0);

    const startOfLastWeek = new Date(startOfThisWeek);
    startOfLastWeek.setDate(startOfLastWeek.getDate() - 7); // Sunday of last week

    return logs.filter(log => new Date(log.date) >= startOfLastWeek && new Date(log.date) < startOfThisWeek).length;
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
    if (logs.length === 0) return ["N/A", "N/A"]; // Return default values if no logs exist

    // Sort logs by date and time_in to get the most recent entry
    logs.sort((a, b) => new Date(b.date + ' ' + b.time_in) - new Date(a.date + ' ' + a.time_in));

    // Format the date as "Feb 15, 2025"
    const lastUsedDate = new Date(logs[0].date).toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

    return [logs[0].pc_number, lastUsedDate]; // Return PC number and formatted date
}


app.set("view engine", "ejs");
app.use(cors());
app.use(express.json());
app.use(
    session({
        secret: "your_secret_key", 
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, 
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

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
