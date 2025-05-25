const admin = require("firebase-admin");
require('dotenv').config();

const decodeBase64AccKey = Buffer.from(process.env.ServiceAccKey, 'base64').toString('utf-8');
const parsedAccKey = JSON.parse(decodeBase64AccKey);





if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(parsedAccKey),
        databaseURL: "https://authentikey-default-rtdb.asia-southeast1.firebasedatabase.app/",
    });
}


const getDatabase = () => admin.database();
const getCorrectionRequestRef = () => getDatabase().ref("studentsRecord/correctionRequest/");
const getComputerUsageLogsRef = () => getDatabase().ref("studentsRecord/logs/");
const getEligibleStudentsRef = () => getDatabase().ref("eligibleStudents/");
const getAdminAccRef = () => getDatabase().ref("adminAccounts/");
const getPCPasswordRef = () => getDatabase().ref("pcPassword/");

module.exports = { 
    admin, 
    getDatabase, 
    getCorrectionRequestRef, 
    getComputerUsageLogsRef,
    getEligibleStudentsRef ,
    getAdminAccRef,
    getPCPasswordRef
};
