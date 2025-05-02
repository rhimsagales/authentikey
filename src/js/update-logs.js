require('dotenv').config();
const mongoose = require('mongoose');
const { getComputerUsageLogsRef } = require("../../firebase-config");

const computerUsageLogsRef = getComputerUsageLogsRef();
const mongoURI = process.env.MongoURI;

// MongoDB Connection with retry logic
async function connectToMongoDB() {
    try {
        await mongoose.connect(mongoURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 5000
        });
        console.log('Connected to MongoDB successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
}

// Updated schema: only studentID, campus, pcLab
const flexibleSchema = new mongoose.Schema({
    studentID: { type: String, required: false },
    campus: { type: String, required: false },
    pcLab: { type: String, required: false }
});

const flexibleModel = mongoose.model('accounts', flexibleSchema);

async function fixDateFormatInLogs() {
    const logsRef = computerUsageLogsRef;
    console.log('Attempting to fetch all student logs...');
    try {
        const snapshot = await logsRef.once('value');
        const allStudentLogs = snapshot.val();

        if (!allStudentLogs) {
            console.log('No student logs found in Firebase.');
            return;
        }

        const studentIds = Object.keys(allStudentLogs);
        console.log(`Found ${studentIds.length} student IDs.`);

        const updatePromises = studentIds.map(async (studentId) => {
            const studentLogsRef = logsRef.child(studentId);
            console.log(`Processing student ID: ${studentId}`);
            const studentLogs = allStudentLogs[studentId];
            const updates = {};

            if (studentLogs) {
                const logIds = Object.keys(studentLogs);
                console.log(`Found ${logIds.length} logs for student ID: ${studentId}`);

                logIds.forEach((logId) => {
                    const log = studentLogs[logId];
                    if (log && log.date) {
                        console.log(`  Checking log ID: ${logId}, current date: "${log.date}"`);
                        if (typeof log.date === 'string' && log.date.includes(':') && log.date.includes('.')) {
                            const originalDate = log.date;
                            const newDate = originalDate.substring(0, originalDate.indexOf(':'));
                            updates[`${logId}/date`] = newDate;
                            console.log(`    Date format needs fixing (contains seconds/milliseconds). Updating to: "${newDate}"`);
                        } else {
                            console.log(`    Date format is either already correct or doesn't contain seconds/milliseconds.`);
                        }
                    } else {
                        console.log(`    Log ID: ${logId} has no 'date' field or it's undefined.`);
                    }
                });

                if (Object.keys(updates).length > 0) {
                    console.log(`  Updating ${Object.keys(updates).length} logs for student ID: ${studentId}`);
                    try {
                        await studentLogsRef.update(updates);
                        console.log(`  Successfully updated date formats for student ID: ${studentId}`);
                    } catch (error) {
                        console.error(`  Error updating date formats for student ID ${studentId}:`, error);
                        throw error; // Re-throw the error to be caught by the outer promise
                    }
                } else {
                    console.log(`  No date format updates needed for student ID: ${studentId}`);
                }
            } else {
                console.log(`  No logs found under student ID: ${studentId}`);
            }
        });

        await Promise.all(updatePromises);
        console.log('Finished checking and updating date formats in all student logs.');

    } catch (error) {
        console.error('Error during the process of updating date formats in logs:', error);
    }
}

connectToMongoDB().then(() => {
    fixDateFormatInLogs();
});