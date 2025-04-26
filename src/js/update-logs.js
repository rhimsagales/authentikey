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

async function updateLogs(studentID, campus, pcLab) {
    try {
        // Step 1: Get student's logs from Firebase
        const studentLogsRef = computerUsageLogsRef.child(studentID);
        const logsSnapshot = await studentLogsRef.once('value');
        const logsData = logsSnapshot.val();

        if (!logsData) {
            console.log(`No logs found for student ID: ${studentID}`);
            return;
        }

        // Step 2: Query MongoDB to verify student exists
        const student = await flexibleModel.findOne({ studentID });
        if (!student) {
            console.log(`Student not found in MongoDB: ${studentID}`);
            return;
        }

        // Step 3: Update each log with campus and pcLab
        const updatedLogs = {};
        Object.entries(logsData).forEach(([logId, log]) => {
            updatedLogs[logId] = {
                ...log,
                campus,
                pcLab
            };
        });

        // Step 4: Replace all logs with updated versions
        await studentLogsRef.set(updatedLogs);
        console.log(`Successfully updated logs for student ID: ${studentID}`);

    } catch (error) {
        console.error('Error updating logs:', error);
        throw error;
    }
}

// Example usage:
connectToMongoDB().then(() => {
    updateLogs('UA202200740', 'Antipolo', '3');
});

module.exports = { updateLogs };
