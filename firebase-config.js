const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

// ✅ Ensure Firebase is initialized only once
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://authentikey-default-rtdb.asia-southeast1.firebasedatabase.app/",
    });
}

// ✅ Use a function to prevent circular dependency issues
const getDatabase = () => admin.database();
const getCorrectionRequestRef = () => getDatabase().ref("studentsRecord/correctionRequest/");
const getComputerUsageLogsRef = () => getDatabase().ref("studentsRecord/logs/");


module.exports = { 
    admin, 
    getDatabase, 
    getCorrectionRequestRef, 
    getComputerUsageLogsRef 
};
