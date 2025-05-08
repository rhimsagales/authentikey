const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");


if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: "https://authentikey-default-rtdb.asia-southeast1.firebasedatabase.app/",
    });
}


const getDatabase = () => admin.database();
const getCorrectionRequestRef = () => getDatabase().ref("studentsRecord/correctionRequest/");
const getComputerUsageLogsRef = () => getDatabase().ref("studentsRecord/logs/");
const getEligibleStudentsRef = () => getDatabase().ref("eligibleStudents/");


module.exports = { 
    admin, 
    getDatabase, 
    getCorrectionRequestRef, 
    getComputerUsageLogsRef,
    getEligibleStudentsRef 
};
