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

const flexibleSchema = new mongoose.Schema({
    studentID: { type: String, required: false },
    name: { type: String, required: false },
    section: { type: String, required: false }
});

const flexibleModel = mongoose.model('accounts', flexibleSchema);

async function updateLogs(studentID, name, section) {
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

        // Step 3: Update each log with name and section
        const updatedLogs = {};
        Object.entries(logsData).forEach(([logId, log]) => {
            updatedLogs[logId] = {
                ...log,
                name,
                section
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
// First connect to MongoDB
connectToMongoDB().then(() => {
    // Then you can call updateLogs
    // updateLogs('your_student_id', 'student_name', 'student_section');
    // Remember to uncomment and replace with actual values when ready to use
    updateLogs('UA202200740', 'Rhim Sagales', 'LFA322E004');
});

module.exports = { updateLogs }; 