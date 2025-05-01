require('dotenv').config();
const mongoose = require('mongoose');
const { getComputerUsageLogsRef, getCorrectionRequestRef } = require("../../firebase-config");

const computerUsageLogsRef = getComputerUsageLogsRef();
const correctionRequestRef = getCorrectionRequestRef();
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

async function updateLogs(studentID, dateField = 'date') {
    try {
        // Step 1: Get student's logs from Firebase
        const studentLogsRef = correctionRequestRef.child(studentID);
        const logsSnapshot = await studentLogsRef.once('value');
        const logsData = logsSnapshot.val();

        if (!logsData) {
            console.log(`No logs found for student ID: ${studentID}`);
            return;
        }

        // Step 2: Update each log's date field
        const updates = {};
        Object.entries(logsData).forEach(([logId, log]) => {
            let updatedDate = log[dateField];

            // Check if the date field exists and is not undefined
            if (updatedDate !== undefined) {
                // Check if the date field is in the longer format
                if (updatedDate && updatedDate.includes(':')) {
                    updatedDate = updatedDate.slice(0, 16); // Extract "YYYY-MM-DDTHH:MM"
                }
                updates[`${logId}/${dateField}`] = updatedDate;
            } else {
                console.warn(`Date field '${dateField}' is undefined for student ID: ${studentID}, log ID: ${logId}. Skipping update for this log.`);
                // You might choose to handle this differently, like setting a default value:
                // updates[`${logId}/${dateField}`] = "1970-01-01T00:00"; // Example default
            }
        });

        // Step 3: Update only the specified date field for all logs
        await studentLogsRef.update(updates);
        console.log(`Successfully updated date format for student ID: ${studentID}`);

    } catch (error) {
        console.error('Error updating logs:', error);
        throw error;
    }
}

async function updateAllLogsDateFormat(dateField = 'date') {
    const logsRef = computerUsageLogsRef;
    const snapshot = await logsRef.once('value');
    const allStudentIds = Object.keys(snapshot.val() || {});

    for (const studentId of allStudentIds) {
        try {
            await updateLogs(studentId, dateField);
            console.log(`Processed student ID: ${studentId}`);
        } catch (error) {
            console.error(`Error processing student ID ${studentId}:`, error);
        }
    }
    console.log('Finished processing all student logs for date format update.');
}

async function addNewFieldToAllLogs(newFieldName, newValue) {
    const logsRef = correctionRequestRef;
    const snapshot = await logsRef.once('value');
    const allStudentLogs = snapshot.val();

    if (!allStudentLogs) {
        console.log('No student logs found in Firebase.');
        return;
    }

    const updatePromises = Object.keys(allStudentLogs).map(async (studentId) => {
        const studentLogsRef = logsRef.child(studentId);
        const studentLogs = allStudentLogs[studentId];
        const updates = {};

        if (studentLogs) {
            Object.keys(studentLogs).forEach((logId) => {
                updates[`${logId}/${newFieldName}`] = newValue;
            });

            try {
                await studentLogsRef.update(updates);
                console.log(`Successfully added field '${newFieldName}' to logs for student ID: ${studentId}`);
            } catch (error) {
                console.error(`Error adding field '${newFieldName}' to logs for student ID ${studentId}:`, error);
                throw error; // Re-throw the error to be caught by the outer promise
            }
        } else {
            console.log(`No logs found for student ID: ${studentId}`);
        }
    });

    try {
        await Promise.all(updatePromises);
        console.log(`Finished adding field '${newFieldName}' with value '${newValue}' to all student logs.`);
    } catch (error) {
        console.error('Error during the process of adding the new field to all logs:', error);
    }
}



// async function updateStudentIDInLogs(studentIdToUpdate, newStudentID) {
//     const studentLogsRef = computerUsageLogsRef.child(studentIdToUpdate);
//     const logsSnapshot = await studentLogsRef.once('value');
//     const studentLogs = logsSnapshot.val();

//     if (!studentLogs) {
//         console.log(`No logs found for student ID: ${studentIdToUpdate}`);
//         return;
//     }

//     const updates = {};
//     Object.keys(studentLogs).forEach((logId) => {
//         updates[`${logId}/studentID`] = newStudentID;
//     });

//     try {
//         await studentLogsRef.update(updates);
//         console.log(`Successfully updated studentID to '${newStudentID}' for all logs of student ID: ${studentIdToUpdate}`);
//     } catch (error) {
//         console.error(`Error updating studentID for student ID ${studentIdToUpdate}:`, error);
//         throw error;
//     }
// }

// module.exports = { updateLogs, updateStudentIDInLogs };

// Example usage within your connectToMongoDB().then(...) block:


connectToMongoDB().then(() => {
    // updateLogs('UA202200740', 'date'); // For testing a single student's date update
    // updateAllLogsDateFormat('date'); // To process all students' date format
    // Example of adding a new field 'deviceType' with the value 'PC' to all logs:
    addNewFieldToAllLogs('studentID', 'UA202200726');
    // updateStudentIDInLogs('UA202201146', 'UA202201146');
});

