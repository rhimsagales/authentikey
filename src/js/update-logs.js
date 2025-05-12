require('dotenv').config();
const mongoose = require('mongoose');
const { getComputerUsageLogsRef, getAdminAccRef } = require("../../firebase-config");

const computerUsageLogsRef = getComputerUsageLogsRef();
const adminAccRef = getAdminAccRef();
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

async function addAccountToAdmin() {
    const data = {
        username : "admin",
        password : "$2a$12$8T83QrVgbcvAolWwGyexJesrysq0RB1IKzLkHaM8Xn3OghaI393JG"
    };

    const adminRef = adminAccRef.child(data.username);

    await adminRef.set(data)
    .then(() => console.log("Successfully added an admin account."))
    .catch((err) => console.log(err))


}

connectToMongoDB().then(() => {
    addAccountToAdmin()
});