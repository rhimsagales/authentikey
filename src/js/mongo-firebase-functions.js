require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const mongoURI = process.env.MongoURI;
const { getCorrectionRequestRef, getComputerUsageLogsRef, getEligibleStudentsRef, getAdminAccRef, getPCPasswordRef, getActivityLogsRef } = require("../../firebase-config");
const admin = require('firebase-admin');
const CryptoJS = require('crypto-js');
const encryptText = require('../../encrypt');




let correctionRequestRef = getCorrectionRequestRef();
let computerUsageLogsRef = getComputerUsageLogsRef();
let eligibleStudentsRef = getEligibleStudentsRef();
let adminAccRef = getAdminAccRef();
let pcPasswordRef = getPCPasswordRef();
let activityLogsRef = getActivityLogsRef();

let activityLogsCreator = {
    createLogAddAdmin : (adminName, newAdminAcc) => {
        return `
        <div class="w-[15%] h-full flex items-center justify-center bg-base-200/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                <path d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 13c.552 0 1.01-.452.9-.994a5.002 5.002 0 0 0-9.802 0c-.109.542.35.994.902.994h8ZM12.5 3.5a.75.75 0 0 1 .75.75v1h1a.75.75 0 0 1 0 1.5h-1v1a.75.75 0 0 1-1.5 0v-1h-1a.75.75 0 0 1 0-1.5h1v-1a.75.75 0 0 1 .75-.75Z" />
            </svg>

        </div>
        <div class="w-[85%] h-full flex flex-col items-start justify-center text-xs text-justify px-2 py-4 overflow-x-hidden break-all">
            <p>
                <span class="font-semibold">[${new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ")}]</span> ${adminName} created new admin account: <span class="font-semibold">${newAdminAcc}</span>.
            </p>
        </div>`
    },
    createLogEditAdmin : (adminName, editedAdminAcc) => {
        return `
            <div class="w-[15%] h-full flex items-center justify-center bg-base-200/20">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M11.013 2.513a1.75 1.75 0 0 1 2.475 2.474L6.226 12.25a2.751 2.751 0 0 1-.892.596l-2.047.848a.75.75 0 0 1-.98-.98l.848-2.047a2.75 2.75 0 0 1 .596-.892l7.262-7.261Z" clip-rule="evenodd" />
                </svg>

            </div>
            <div class="w-[85%] h-full flex flex-col items-start justify-center text-xs text-justify px-2 py-4 overflow-x-hidden break-all">
                <p>
                    <span class="font-semibold">[${new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ")}]</span> ${adminName} updated admin account: <span class="font-semibold">${editedAdminAcc}</span>.
                </p>
            </div>
        `
    },
    createLogDeleteAdmin : (adminName, deletedAdminAcc) => {
        return `
        <div class="w-[15%] h-full flex items-center justify-center bg-base-200/20">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                <path d="M8.5 4.5a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0ZM10 13c.552 0 1.01-.452.9-.994a5.002 5.002 0 0 0-9.802 0c-.109.542.35.994.902.994h8ZM10.75 5.25a.75.75 0 0 0 0 1.5h3.5a.75.75 0 0 0 0-1.5h-3.5Z" />
            </svg>

        </div>
        <div class="w-[85%] h-full flex flex-col items-start justify-center text-xs text-justify px-2 py-4 overflow-x-hidden break-all">
            <p>
                <span class="font-semibold">[${new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ")}]</span> ${adminName} deleted admin account: <span class="font-semibold">${deletedAdminAcc}</span>.
            </p>
        </div>
        `
    },
    createLogImportStudents : (adminName) => {
        return `
            <div class="w-[15%] h-full flex items-center justify-center bg-base-200/20">
                <!-- Upload icon -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path d="M8.75 6h-1.5V3.56L6.03 4.78a.75.75 0 0 1-1.06-1.06l2.5-2.5a.75.75 0 0 1 1.06 0l2.5 2.5a.75.75 0 1 1-1.06 1.06L8.75 3.56V6H11a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.25v5.25a.75.75 0 0 0 1.5 0V6Z" />
                </svg>

            </div>
            <div class="w-[85%] h-full flex flex-col items-start justify-center text-xs text-justify px-2 py-4 overflow-x-hidden break-all">
                <p>
                    <span class="font-semibold">[${new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ")}]</span> ${adminName} imported a list of eligible students.
                </p>
            </div>
        `
    },
    createLogApprovedRequest : (adminName, studentID, requestNumber) => {
        return `
            <div class="w-[15%] h-full flex items-center justify-center bg-base-200/20">
                <!-- Check circle icon -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.844-8.791a.75.75 0 0 0-1.188-.918l-3.7 4.79-1.649-1.833a.75.75 0 1 0-1.114 1.004l2.25 2.5a.75.75 0 0 0 1.15-.043l4.25-5.5Z" clip-rule="evenodd" />
                </svg>

            </div>
            <div class="w-[85%] h-full flex flex-col items-start justify-center text-xs text-justify px-2 py-4 overflow-x-hidden break-all">
                <p>
                    <span class="font-semibold">[${new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ")}]</span> ${adminName} approved a correction request - ${requestNumber} - from student <span class="font-semibold">${studentID}</span>.
                </p>
            </div>
        `
    },
    createLogRejectRequest : (adminName, studentID, requestNumber) => {
        return `
            <div class="w-[15%] h-full flex items-center justify-center bg-base-200/20">
                    <!-- X circle icon -->
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                        <path fill-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm2.78-4.22a.75.75 0 0 1-1.06 0L8 9.06l-1.72 1.72a.75.75 0 1 1-1.06-1.06L6.94 8 5.22 6.28a.75.75 0 0 1 1.06-1.06L8 6.94l1.72-1.72a.75.75 0 1 1 1.06 1.06L9.06 8l1.72 1.72a.75.75 0 0 1 0 1.06Z" clip-rule="evenodd" />
                    </svg>

                </div>
                <div class="w-[85%] h-full flex flex-col items-start justify-center text-xs text-justify px-2 py-4 overflow-x-hidden break-all">
                    <p>
                        <span class="font-semibold">[${new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ")}]</span> ${adminName} rejected a correction request - ${requestNumber} - from student <span class="font-semibold">${studentID}</span>.
                    </p>
                </div>
        `
    },
    createLogRetrieveLogs : (adminName) => {
        return `
            <div class="w-[15%] h-full flex items-center justify-center bg-base-200/20">
                <!-- Document arrow down icon -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M4 2a1.5 1.5 0 0 0-1.5 1.5v9A1.5 1.5 0 0 0 4 14h8a1.5 1.5 0 0 0 1.5-1.5V6.621a1.5 1.5 0 0 0-.44-1.06L9.94 2.439A1.5 1.5 0 0 0 8.878 2H4Zm4 3.5a.75.75 0 0 1 .75.75v2.69l.72-.72a.75.75 0 1 1 1.06 1.06l-2 2a.75.75 0 0 1-1.06 0l-2-2a.75.75 0 0 1 1.06-1.06l.72.72V6.25A.75.75 0 0 1 8 5.5Z" clip-rule="evenodd" />
                </svg>

            </div>
            <div class="w-[85%] h-full flex flex-col items-start justify-center text-xs text-justify px-2 py-4 overflow-x-hidden break-all">
                <p>
                    <span class="font-semibold">[${new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ")}]</span> ${adminName} retrieved computer usage logs.
                </p>
            </div>
        `
    },
    createLogDeleteLogs : (adminName) => {
        return `
            <div class="w-[15%] h-full flex items-center justify-center bg-base-200/20">
                <!-- Trash icon -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M5 3.25V4H2.75a.75.75 0 0 0 0 1.5h.3l.815 8.15A1.5 1.5 0 0 0 5.357 15h5.285a1.5 1.5 0 0 0 1.493-1.35l.815-8.15h.3a.75.75 0 0 0 0-1.5H11v-.75A2.25 2.25 0 0 0 8.75 1h-1.5A2.25 2.25 0 0 0 5 3.25Zm2.25-.75a.75.75 0 0 0-.75.75V4h3v-.75a.75.75 0 0 0-.75-.75h-1.5ZM6.05 6a.75.75 0 0 1 .787.713l.275 5.5a.75.75 0 0 1-1.498.075l-.275-5.5A.75.75 0 0 1 6.05 6Zm3.9 0a.75.75 0 0 1 .712.787l-.275 5.5a.75.75 0 0 1-1.498-.075l.275-5.5a.75.75 0 0 1 .786-.711Z" clip-rule="evenodd" />
                </svg>

            </div>
            <div class="w-[85%] h-full flex flex-col items-start justify-center text-xs text-justify px-2 py-4 overflow-x-hidden break-all">
                <p>
                    <span class="font-semibold">[${new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ")}]</span> ${adminName} deleted filtered computer usage logs.
                </p>
            </div>
        `
    },
    createLogChangePCPassword : (adminName, newPCPassword) => {
        return `
            <div class="w-[15%] h-full flex items-center justify-center bg-base-200/20">
                <!-- Key icon -->
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" class="size-4">
                    <path fill-rule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clip-rule="evenodd" />
                </svg>

            </div>
            <div class="w-[85%] h-full flex flex-col items-start justify-center text-xs text-justify px-2 py-4 overflow-x-hidden break-all">
                <p>
                    <span class="font-semibold">[${new Date(Date.now() + 8 * 60 * 60 * 1000).toISOString().slice(0, 16).replace("T", " ")}]</span> ${adminName} updated the PC password used by Authentikey to ${newPCPassword}.
                </p>
            </div>
        `
    }
}


const flexibleSchema = new mongoose.Schema({
    studentID: { type: String, required: false },
    password: { type: String, required: false },
    confirmPassword: { type: String, required: false },
    name: { type: String, required: false },
    section: { type: String, required: false },
    email: { type: String, required: false },
    course: { type: String, required: false },
    yearLevel: { type: String, required: false },
    agreePolicy: { type: Boolean, required: false },
    campus : { type: String, required: false }
});

const flexibleModel = mongoose.model('accounts', flexibleSchema);



const resetRecordSchema = new mongoose.Schema({
    email : String,
    resetCode : Number,
    expirationTime : {
        type : Date,
        required : false
    }
});

const resetRecordModel = mongoose.model('passwordresets', resetRecordSchema);


function getCourseAbbreviation(courseName) {
    
    const courseAbbreviations = {
        "Bachelor of Arts in Communication": "ABCom",
        "Bachelor of Arts in English": "ABEng",
        "Bachelor of Science in Mathematics": "BSM",
        "Bachelor of Science in Psychology": "BSP",
        "Associate in Business Administration": "ABA",
        "Bachelor of Science in Accounting Information System": "BSAIS",
        "Bachelor of Science in Accountancy": "BSA",
        "Bachelor of Science in Management Accounting": "BSMA",
        "Bachelor of Science in Real Estate Management": "BSREM",
        "Bachelor of Science in Internal Auditing": "BSIA",
        "Bachelor of Science in Business Administration": "BSBA",
        "Associate in Computer Technology": "ACT",
        "Bachelor of Science in Computer Science": "BSCS",
        "Bachelor of Science in Information Technology": "BSIT",
        "Bachelor of Science in Information System": "BSIS",
        "Bachelor in Early Childhood Education": "BECEd",
        "Bachelor in Elementary Education": "BEEd",
        "Bachelor in Secondary Education": "BSEd",
        "Bachelor in Technical Vocational Teacher Education": "BTVTEd",
        "Bachelor of Science in Marine Transportation": "BSMT",
        "Bachelor of Science in Criminology": "BSC",
        "Bachelor of Science in Industrial Security Management": "BSISM",
        "Bachelor of Science in Public Administration": "BSPA",
        "Bachelor of Science in Computer Engineering": "BSCE",
        "Bachelor of Science in Electronics Engineering": "BSELE",
        "Bachelor of Science in Medical Technology": "BSMedTech",
        "Bachelor of Science in Hospitality Management": "BSHM",
        "Bachelor of Science in Tourism Management": "BSTM"
    };
  
    
    return courseAbbreviations[courseName] || "Abbreviation not found";
}

function isTransientError(error) {
    if (
        error.name === 'MongoNetworkError' || 
        error.code === 11000 || 
        error.code === 'ECONNRESET' || 
        error.code === 'ETIMEDOUT' || 
        error.name === 'TimeoutError' || 
        error.code === 'MONGO_ERROR' || 
        error.name === 'MongoTimeoutError' || 
        error.code === 'ECONNREFUSED' || 
        error.code === 'ENOTFOUND' || 
        error.code === 'ENETUNREACH' || 
        error.code === 'ENETDOWN' || 
        error.code === 'SERVER_SELECTION_TIMEOUT' || 
        error.code === 'EAI_AGAIN'
    ) {
        return true;
    }
    return false;
}

async function retryWithExponentialDelay(func, retries = 5, delay = 1000) {
    let retryCount = 1;
    while (retryCount <= retries) {
        
        try {
            
            const result = await func();  
            return result;  
        } 
        catch (error) {
            console.log(`RetryCount: ${retryCount}`);  
            if (isTransientError(error)) {
                if (retryCount < retries) {  
                    retryCount++;
                    delay *= 2;
                    await new Promise((resolve) => setTimeout(resolve, delay));
                } 
                else {
                    throw error;
                }
            } 
            else {
                throw error;
            }
        }
    }
}

async function retryMongoConnection(uri, retries = 5, delay = 1000) {
    let retryCount = 0;

    while (retryCount < retries) {
        try {
            await mongoose.connect(uri);
            console.log('Connected to MongoDB');
            return; 
        } catch (error) {
            console.error(`MongoDB connection attempt ${retryCount + 1} failed:`);

            if (retryCount < retries - 1) {
                retryCount++;
                delay *= 2; 
                await new Promise(resolve => setTimeout(resolve, delay));
            } else {
                console.error('All MongoDB connection attempts failed.');
                throw error;
            }
        }
    }
}

function handleMongoDisconnection(MONGO_URI, maxRetries = 10, delay = 5000) {
    let retryCount = 0;

    mongoose.connection.removeAllListeners('disconnected'); 
    mongoose.connection.on('disconnected', async () => {
        if (retryCount >= maxRetries) {
            console.error('Max reconnection attempts reached. Exiting...');
            process.exit(1);
        }

        console.warn(`MongoDB disconnected! Attempting to reconnect... (Attempt ${retryCount + 1}/${maxRetries})`);
        retryCount++;

        await new Promise(resolve => setTimeout(resolve, delay));
        try {
            await mongoose.connect(MONGO_URI);
            console.log('Reconnected to MongoDB');
            retryCount = 0;
        } catch (err) {
            console.error('Reconnection failed:', err.message);
        }
    });
}





async function connectToMongoDB() {
    try {
        await retryMongoConnection(mongoURI);
        handleMongoDisconnection(mongoURI);
    } catch (err) {
        console.error('Failed to connect to MongoDB after retries:');
        process.exit(1); 
    }
}



async function deleteResetPassDocs(req, res) {
    const { email, resetCode, expirationTime } = req.body;

    

    try {
        if(!email || !resetCode || !expirationTime) {
            throw new Error('Inputs are empty.');
        }
        let existingEmail = await retryWithExponentialDelay(() =>
        resetRecordModel.findOne({ email: email , resetCode : resetCode, expirationTime : expirationTime}));

        if(!existingEmail) {
            throw new Error("The email you entered is not found in our database.")
        }

        let deleteSuccess = await retryWithExponentialDelay(() =>
        resetRecordModel.deleteOne({ email: email , resetCode : resetCode, expirationTime : expirationTime}));

        if(!deleteSuccess) {
            throw new Error("Unable to delete the reset code document.")
        }
        
        return res.status(200).json({
            success: true,
            message: "Reset password document deleted successfully.",
        })
    }
    catch(error) {
        res.status(400).json({
            success: false,
            message: error.message
        })
    }
}

async function compareResetCode(req, res) {
    const { email, resetCode } = req.body;
    
    try {
        
        if (!email || !resetCode) {
            throw new Error('Inputs are empty.');
        }

        
        const latestResetPassDoc = await retryWithExponentialDelay(() => resetRecordModel.findOne({
            email: email,
            resetCode: resetCode,
        }));

        
        if (!latestResetPassDoc) {
            throw new Error("The reset code doesn't match our records.");
        }

        
        if (new Date(latestResetPassDoc.expirationTime) < new Date()) {
            const isDeleteSuccess = await retryWithExponentialDelay(() => resetRecordModel.deleteOne({
                email: email,
                resetCode: resetCode,
            }));

            if (isDeleteSuccess.deletedCount === 0) {
                throw new Error("Unable to delete the reset code document.");
            }

            throw new Error("The reset code has expired.");
        }

        
        const isDeleteSuccess = await retryWithExponentialDelay(() => resetRecordModel.deleteOne({
            email: email,
            resetCode: resetCode,
        }));

        if (isDeleteSuccess.deletedCount === 0) {
            throw new Error("Unable to delete the reset code document.");
        }

        return res.status(200).json({
            success: true,
            message: "Reset code is valid and has not expired."
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}


async function changePassword(req, res) {
    const { email ,password } = req.body;

   

    try {
        if(!password) {
            throw new Error("Password field is empty.")
        }

        const newHashedPass = await retryWithExponentialDelay(() => bcrypt.hash(password, 10));

        const result = await retryWithExponentialDelay(() => flexibleModel.updateOne(
            {
                email : email
            },
            {
                $set: {
                    password : newHashedPass,
                    confirmPassword : newHashedPass
                }
            }
            ) 
        ) 

        if (result.matchedCount === 0) {
            throw new Error("User not found");
        }

        else if (result.modifiedCount === 0) {
            throw new Error("Password not updated");
        }
        return res.status(200).json({
            success: true,
            message: "Password updated successfully"
        })
    }
    catch(error) {
        return res.status(400).json({
            success: false,
            message: error.message
        })
    }
}







async function checkIfStudentIDExists(studentIDToCheck) {
    try {
        const snapshot = await eligibleStudentsRef.once('value');

        
        if (!snapshot.exists()) {
            return true; 
        }

        let exists = false;

        snapshot.forEach((childSnapshot) => {
            const currentStudentID = childSnapshot.val();
            if (currentStudentID === studentIDToCheck) {
                exists = true;
                return true; 
            }
        });

        return exists;

    } catch (error) {
        console.error("Error checking for Student ID:", error);
        return false; 
    }
}

async function checkStudentIdAvailability(req, res) {
    const { studentID } = req.body; 

    if (!studentID) {
        return res.status(400).json({ 
            available: false,
            message: 'Student ID is required.' 
        });
    }

    try {
        const isEligible = await checkIfStudentIDExists(studentID);
        if(!isEligible) {
            return res.json({ 
                available: false,
                message: 'Ineligible Student ID for registration.'
            });
        }
        const existingUser = await retryWithExponentialDelay(() => flexibleModel.findOne({ studentID }));

        if (existingUser) {
            return res.json({ 
                available: false,
                message: 'Student ID already exists.'
            });
        } else {
            return res.json({ 
                available: true 
            });
        }
    } catch (error) {
        console.error('CheckingStudentID Error:', error);
        res.status(500).json({
            available: false,
            message: "Student ID availability check failed. Please try again."
        });
    }
}


  

async function registerAccount(req, res) {
    try {
      const { studentID, password, confirmPassword, name, section, email, course, yearLevel, campus, agreePolicy } = req.body;
  
      
      if (!studentID || !password || !confirmPassword || !name || !section || !email || !course || !yearLevel || !campus || !agreePolicy) {
        return res.status(400).json({
          successRegistration: false,
          message: "All fields are required.",
        });
      }
  
      
      if (password !== confirmPassword) {
        return res.status(400).json({
          successRegistration: false,
          message: "Passwords do not match.",
        });
      }
  
      
      const existingEmail = await retryWithExponentialDelay(() => flexibleModel.findOne({ email }));
      if (existingEmail) {
        return res.status(400).json({
          successRegistration: false,
          message: "Email already exists. Please try another email.",
        });
      }
  
      const existingStudent = await retryWithExponentialDelay(() => flexibleModel.findOne({ studentID }));
      if (existingStudent) {
        return res.status(400).json({
          successRegistration: false,
          message: "Student ID already exists.",
        });
      }
  
      const hashedPassword = await retryWithExponentialDelay(() => bcrypt.hash(password, 10));
  
      const account = await retryWithExponentialDelay(() => flexibleModel.create({
        studentID: studentID,
        password: hashedPassword,
        confirmPassword: hashedPassword,
        name: name,
        section: section,
        email: email,
        course: course,
        yearLevel: yearLevel,
        campus: campus,
        agreePolicy: agreePolicy
      }));
  
      if (!account)
      {
         return res.status(500).json({
          successRegistration: false,
          message: "Account creation failed.",
        });
      }
      
      res.status(201).json({
        successRegistration: true,
        message: "Registration completed successfully."
      });
  
  
    } catch (error) {
      console.error('RegisterERR:', error);
      res.status(500).json({
        successRegistration: false,
        message: "Registration failed. Please try again.",
      });
    }
  }
  
  

function login(req, res) {
    let login = async () => {
        const { studentID, password } = req.body;
        if (!studentID || !password) {
            return res.status(400).json({
                successLogin: false,
                message: "Please enter both student ID and password.",
            });
        }

        try {
            const user = await retryWithExponentialDelay(() => flexibleModel.findOne({ studentID }));

            if (!user) {
                
                return res.status(400).json({
                    successLogin: false,
                    message: "The student ID is not registered in the database."
                });
            }

            const isMatch = await retryWithExponentialDelay(() => bcrypt.compare(password, user.password));
            if (!isMatch) {
                return res.status(400).json({
                    successLogin: false,
                    message: "Incorrect password. Please try again."
                });
            }
            
            req.session.regenerate((err) => {
                if (err) {
                    console.error("Session regeneration failed:", err);
                    return res.status(500).send("Server error");
                }
                
                req.session.user = { id: user.id, role: user.role };
                req.session.studentID = user.toObject().studentID; 
                res.status(200).json({
                    successLogin: true,
                    message: "Login successful."
                });
                
            });
            

        } catch (error) {
            console.log(`LoginERR: ${error}`);
            res.status(500).json({
                successLogin: false,
                message: "Login failed. Please try again."
            });
        }
    };
    login();
}


async function getAllLogs(req, res, studentID) {
    try {
        const userData = await retryWithExponentialDelay(() => flexibleModel.findOne({ studentID }));
        const userObject = userData.toObject();
        const user = {
            studentID : userObject.studentID,
            name : userObject.name,
            section : userObject.section,
            email : userObject.email,
            course : userObject.course,
            yearLevel : userObject.yearLevel,
            campus : userObject.campus
        }

        if (!user) {
            
            return res.status(400).json({
                successLogin: false,
                message: "The student ID is not registered in the database."
            });
        }

        
        
        req.session.user = user;
        
    } catch (error) {
        console.log(`LoginERR: ${error}`);
        res.status(500).json({
            successLogin: false,
            message: "Login failed. Please try again."
        });
    }
} 

async function adminLogin(req, res) {
    const { username, password } = req.body; 

    if(!username || !password) {
        res.status(400).json({
            success : false,
            message : "All fields are required."
        })
    }

    try {
        // const adminSnapShot = await adminAccRef.child(username).once("value");
        // if(!adminSnapShot.exists()) {
        //     return res.status(400).json({
        //         success: false,
        //         message : "The username you entered is not recognized."
        //     });
        // }
        const adminSnapShot = await adminAccRef.once("value");
        const adminInfo = adminSnapShot.val();
        // console.log(adminInfo);
        // console.log(password)
        // console.log(adminInfo.password)

        let exists = false;
        let admin;
        for(const key in adminInfo) {
            admin = adminInfo[key];

            if(admin.username == username) {
                exists = true;
                break;
            }
        }

        if(!exists) {
            return res.status(400).json({
                success: false,
                message : "The username you entered is not recognized."
            });
        }

        // const decrypted = CryptoJS.RC4.decrypt(adminInfo.password, '');
        const decrypted = CryptoJS.RC4.decrypt(admin.password, '');
        const pas = decrypted.toString(CryptoJS.enc.Utf8);
        // const isMatch = await bcrypt.compare(password, adminInfo.password);
        const isMatch = password === pas;
        if(isMatch) {
            req.session.regenerate((err) => {
                if (err) {
                    console.error("Session regeneration failed:", err);
                    return res.status(500).send("Server error");
                }
                
                req.session.admin = {
                    username : admin.username,
                    role : admin.role
                };
                return res.status(200).json({
                    successLogin: true,
                    message: "Login successful."
                });
                
            });
        }
        else {
            return res.status(401).json({
                success : false,
                message : "The password you entered is incorrect."
            })
        }
    }
    catch(e) {
        console.log(`AdminLoginERR: ${e}`);
        return res.status(500).json({
            success : false,
            message : "We've encountered some problems while logging you in. Please try again later."
        })
    }
}

async function createResetPassDoc(req, res) {
    let { email } = req.body;

    const generateResetCode = () => Math.floor(100000 + Math.random() * 900000);

    let resetCode = generateResetCode();
    const expirationTime = Date.now() + 5 * 60 * 1000;

    try {
        if (!email) {
            throw new Error("Please provide an email.");
        }

        let existingEmail = await retryWithExponentialDelay(() => 
            flexibleModel.findOne({ email })
        );

        if (!existingEmail) {
            throw new Error("The email you entered is not found in our database.");
        }

        
        let existingCode = await resetRecordModel.findOne({ resetCode });
        while (existingCode) {
            resetCode = generateResetCode(); 
            existingCode = await resetRecordModel.findOne({ resetCode });
        }

        let createResetDoc = await retryWithExponentialDelay(() =>
            resetRecordModel.create({
                email: email,
                resetCode: resetCode,
                expirationTime: expirationTime, 
            })
        );

        if (!createResetDoc) {
            throw new Error("Unable to process your reset code.");
        }

        
        return res.status(200).json({
            success: true,
            message: "Reset password document created successfully.",
            resetCode: resetCode,
            email: email,
            expirationTime: expirationTime, 
        });

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

async function insertCorrectionRequest(req, res) {
    const { studentID, fullName, email, subject, dateRecord, correctionDetails } = req.body;

    try {
        
        if (!studentID || !fullName || !email || !subject || !dateRecord || !correctionDetails) {
            console.log({
                fullName,
                email,
                subject,
                dateRecord,
                correctionDetails
            });
            return res.status(400).json({ success: false, message: 'All fields are required.' });
        }

        
        const studentCorrectionRequestRef = correctionRequestRef.child(studentID);

        
        let requestNumber;
        let recordID;
        try {
            const snapshot = await studentCorrectionRequestRef.get()
            .catch(() =>{
                throw new Error("No matching record found for the provided date.");
            });
            requestNumber = snapshot.exists() ? snapshot.numChildren() + 1 : 1;


            const snapshotLogs = await computerUsageLogsRef.get();
            const snapshotLogsVal = snapshotLogs.val();
            
            if (!snapshotLogsVal[studentID]) {
                throw new Error("No logs found for the provided student ID.");
            }
            
            for (const recordIDFor in snapshotLogsVal[studentID]) {
                const log = snapshotLogsVal[studentID][recordIDFor]; 
                if(!log) {
                    throw new Error("No matching record found for the provided date.");
                }
                if (log.date === dateRecord) { 
                    recordID = recordIDFor; 
                    break;
                }
            }
        
            if (!recordID) {
                throw new Error("No matching record found for the provided date.");
            }
            

        } catch (err) {
            return res.status(500).json({ success: false, message: err.message? err.message : 'Error processing request.' });
        }
        
        



        const correctionRequestObj = {
            requestNumber,
            recordID : recordID,
            studentID,
            fullName,
            email,
            subject,
            dateRecord,
            correctionDetails : `${correctionDetails}`,
            status: "Pending", 
            timestamp: Date.now() 
        };
        
        try {
            await studentCorrectionRequestRef.push(correctionRequestObj);
            return res.status(200).json({ success: true, message: 'Correction request submitted successfully.' });
        } catch (err) {
            console.error("Error saving request:", err);
            return res.status(500).json({ success: false, message: 'Failed to submit request.' });
        }

    } catch (error) {
        console.error("Error in insertCorrectionRequest:", error);
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
    }
}


async function updatePersonalInfo (req, res) {
    try {
        const { studentID, name, newStudentID, email, section, course, yearLevel, campus } = req.body;
        
        if (!name || !newStudentID || !email || !section || !course || !yearLevel || !campus) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const student = await retryWithExponentialDelay(() => flexibleModel.findOne({ studentID }));
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }
        let existNewStudentID;
        if(studentID != newStudentID) {
            existNewStudentID = await retryWithExponentialDelay(() => flexibleModel.findOne({ studentID : newStudentID }));

            if(!!existNewStudentID){
                return res.status(409).json({
                    message : "The new Student ID is already in use."
                })
            }
        }
        
        student.name = name;
        student.email = email;
        student.section = section;
        student.course = course;
        student.yearLevel = yearLevel;
        student.studentID = newStudentID;
        student.campus = campus;
        
        await student.save();

        return res.status(200).json({ message: "Student updated successfully. Please log in again.", student });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Internal Server Error." });
    }
};


async function updatePassword (req, res) {
    try {
        const { password, studentID } = req.body;

        if (!password || !studentID) {
            return res.status(400).json({ message: "All fields are required." });
        }

        

        const student = await flexibleModel.findOne({ studentID });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        const newHashedPass = await retryWithExponentialDelay(() => bcrypt.hash(password, 10));

        student.password = newHashedPass;
        student.confirmPassword = newHashedPass;

        await student.save();

        return res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};


async function deleteStudent  (req, res) {
    try {
        const { studentID } = req.body;

        if (!studentID) {
            return res.status(400).json({ message: "Student ID is required." });
        }

        const deletedStudent = await retryWithExponentialDelay(() => flexibleModel.findOneAndDelete({ studentID }));
        if (!deletedStudent) {
            return res.status(404).json({ message: "Student not found." });
        }
        req.session.destroy((err) => {
            if (err) {
                console.error("Error destroying session:", err);
                return res.status(500).end();
            }
    
            res.clearCookie("connect.sid");
            return res.status(200).json({ message: "Student deleted successfully." });
        });

        
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};


async function findAndPushData(req, res) {
    try {
        const { studentID, timeIn, timeOut, date, pcNumber, pcLab } = req.body;

        if (!studentID || !timeIn || !timeOut || !date || !pcNumber || !pcLab) {
            return res.status(400).json({ 
                success: false, 
                message: "Missing required fields",
                body: req.body 
            });
        }

        const student = await retryWithExponentialDelay(() => flexibleModel.findOne({ studentID }));
        
        if (!student) {
            
            return res.status(404).json({
                success: false,
                message: "Student not found in the database"
            });
        }

        const studentComputerUsageRef = computerUsageLogsRef.child(studentID);

        const newComputerLog = {
            studentID,
            name: student.name,
            section: student.section,
            course : getCourseAbbreviation(student.course),
            campus : student.campus,
            yearLevel : student.yearLevel,
            timeIn,
            timeOut,
            date : date.substring(0, 16),
            pcNumber,
            pcLab

        };

        await studentComputerUsageRef.push(newComputerLog);
        const messageRef = computerUsageLogsRef.child(studentID).child('message');
        const messageSnapshot = await messageRef.get();

        if(messageSnapshot.exists()) {
            await messageRef.remove()
        }


        return res.status(200).json({ success: true, message: "Log added successfully" });

    } catch (error) {
        console.error("Error adding log:", error);
        return res.status(500).json({ 
            success: false, 
            message: "Internal Server Error",
            error: error.message 
        });
    }
}



async function findStudentID(req, res) {
    const { studentID } = req.body;

    if (!studentID) {
        return res.status(400).json({
            studentIDExist: null,
            message: "No student ID was provided."
        });
    }

    try {
        const student = await retryWithExponentialDelay(() => flexibleModel.findOne({ studentID }));

        return res.status(200).json({
            studentIDExist: !!student,
            message: student ? "Student ID exists in the database." : "Student ID not found in the database."
        });
    } catch (error) {
        return res.status(500).json({
            studentIDExist: null,
            message: "An error occurred while checking the student ID.",
            error: error.message
        });
    }
}

async function getFilteredLogs(req, res) {
    try {
        const { studentID, section, course, yearLevel, campus, pcLab, startDate, endDate, filter } = req.body;


        const logsSnapshot = await computerUsageLogsRef.once('value');
        const logsData = logsSnapshot.val();
        
        if (!logsData) {
            return res.json({ success: true, logs: [] });
        }

        let logs = [];
        Object.entries(logsData).forEach(([studentId, studentLogs]) => {
            if (studentLogs) {
                Object.entries(studentLogs).forEach(([logId, log]) => {
                    logs.push({
                        ...log,
                        id: logId,
                        studentID: studentId
                    });
                });
            }
        });
        if (studentID) {
            logs = logs.filter(log => log.studentID === studentID);
        }

        if (section) {
            logs = logs.filter(log => log.section === section);
        }

        if (course) {
            logs = logs.filter(log => log.course === course);
        }

        if (yearLevel) {
            logs = logs.filter(log => {
                const match = log.yearLevel === yearLevel;
                return match;
            });
        }
        
        if (campus) {
            logs = logs.filter(log => {
                const match = log.campus === campus;
                console.log(`Filtering by campus (${campus}): Log campus = ${log.campus}, Match = ${match}`);
                return match;
            });
        }
        
        if (pcLab) {
            logs = logs.filter(log => {
                const match = log.pcLab == pcLab;
                console.log(`Filtering by pcLab (${pcLab}): Log pcLab = ${log.pcLab}, Match = ${match}`);
                return match;
            });
        }
        
        if (course) {
            logs = logs.filter(log => log.course === course);
        }

        if (yearLevel) {
            logs = logs.filter(log => log.yearLevel === yearLevel);
        }

        if (campus) {
            logs = logs.filter(log => log.campus === campus);
        }

        if (pcLab) {
            logs = logs.filter(log => log.pcLab == pcLab);
        }
        

        if (startDate || endDate) {
            logs = logs.filter(log => {
                const logDate = new Date(log.date); 
        
                if (startDate && endDate) {
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    start.setHours(0, 0, 0, 0);
                    end.setHours(23, 59, 59, 999);
                    return logDate >= start && logDate <= end;
                } else if (startDate) {
                    const start = new Date(startDate);
                    start.setHours(0, 0, 0, 0);
                    return logDate >= start;
                } else if (endDate) {
                    const end = new Date(endDate);
                    end.setHours(23, 59, 59, 999);
                    return logDate <= end;
                }
                return true;
            });
        }

        if (filter === 'latest') {
            logs.sort((a, b) => new Date(b.date) - new Date(a.date));
        } 
        else if (filter === 'oldest') {
            logs.sort((a, b) => new Date(a.date) - new Date(b.date));
        }

        await activityLogsRef.push(activityLogsCreator.createLogRetrieveLogs(req.session.admin.username))
        return res.json({ success: true, logs });
    } catch (error) {
        console.error('Error in getFilteredLogs:', error);
        return res.status(500).json({ 
            success: false, 
            message: 'An error occurred while fetching logs' 
        });
    }
}

async function adminApproveModifyLogs(req, res) {
    const { requestID, recordID, studentID, dateOfConcern, newDate, newTimeIn, newTimeOut } = req.body;
    
    if(!requestID || !recordID || !studentID || !dateOfConcern || !newDate || !newTimeIn || !newTimeOut) {
        return res.status(400).json({
            message : "All fields are required."
        })
    }

    try {
        const recordRef = computerUsageLogsRef.child(studentID).child(recordID);
        const correctionRecordRef = correctionRequestRef.child(studentID).child(requestID);

        await recordRef.update({
            date: newDate,
            timeIn: newTimeIn,
            timeOut: newTimeOut
        });
        await correctionRecordRef.update({
            status : "Approved"
        });

        await activityLogsRef.push(activityLogsCreator.createLogApprovedRequest(req.session.admin.username, studentID, requestID))
        return res.status(200).json({
            message: "Log updated successfully."
        });
    } catch (error) {
        console.error("Error updating log:", error);
        return res.status(500).json({
            message: "An error occurred while updating the log.",
            
        });
    }


    

}

async function adminRejectModifyLogs(req, res) {
    const { studentID, requestID } = req.body;

    if(!studentID || !requestID) {
        return res.status(400).json({
            message : "All fields are required."
        })
    }
    const correctionReqRecordRef = correctionRequestRef.child(studentID).child(requestID);
    try {
        await correctionReqRecordRef.update({
            status : "Rejected"
        });

        await activityLogsRef.push(activityLogsCreator.createLogRejectRequest(req.session.admin.username, studentID, requestID))
        res.status(200).json({
            message : "The rejection was successful."
        })
    }
    catch(e){
        console.error("Error updating log:", e);
        return res.status(500).json({
            message: "An error occurred while updating the log.",
            
        });
    }
}

async function uploadEligibleStudentIDS(req, res) {
    const { studentIDS } = req.body; 
    // console.log(req.body);

    if (!studentIDS || studentIDS.length === 0) { 
        return res.status(400).json({
            message: "Please provide Student IDs."
        });
    }

    try {
        // Clear the existing nodes
        await eligibleStudentsRef.set(null);

        const updates = {};
        for (const id of studentIDS) {
            const newKey = eligibleStudentsRef.push().key; 
            updates[`/${newKey}`] = id;
        }
        await eligibleStudentsRef.update(updates); 
        await activityLogsRef.push(activityLogsCreator.createLogImportStudents(req.session.admin.username))
        return res.status(200).json({ message: "Student IDs uploaded successfully." });

    } catch (error) {
        console.error("Error uploading Student IDs:", error); 
        return res.status(500).json({
            message: "An error occurred while uploading the Student IDs. Please try again later."
        });
    }
}


async function checkEligibility(req, res, pcPassword) {
    const { studentID } = req.body;

    if (!studentID) {
        return res.status(400).json({
            message: "Student ID is required.",
            pcPassword: pcPassword
        });
    }

    try {
        const snapshot = await eligibleStudentsRef.once('value');
        let isEligible = false;

        snapshot.forEach((childSnapshot) => {
            const currentStudentID = childSnapshot.val();
            if (currentStudentID === studentID) {
                isEligible = true;
                return true; 
            }
        });

        if (isEligible) {
            return res.status(200).json({
                isEligible : true,
                message: "The student ID is eligible.",
                pcPassword : pcPassword
            });
        
        } else {
            return res.status(400).json({
                isEligible : false,
                message: "The student ID is not eligible.",
                pcPassword : pcPassword
            });
        }
    }
    catch (error) {
        console.error("Error checking eligibility:", error);
        return res.status(500).json({
            isEligible : null,
            message: "An error occurred while checking eligibility.",
            pcPassword : pcPassword
        });
    }

}

async function editAdminCredentials (req, res) {
    const { currentUsername, newUsername, newPassword, newRole } = req.body;
    const isInvalid = [currentUsername, newUsername, newPassword, newRole].some(value => value == null || value.toString().trim() === '');

    if(isInvalid){
        return res.status(400).json({
            success : false,
            message : "All fields are required."
        }) 
    }

    try {
        // const adminRef = adminAccRef.child(currentUsername);
        // const newAdminRef = adminAccRef.child(newUsername);
        // const adminData = (await adminRef.get()).val();

        // if (!adminData) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Admin not found."
        //     });
        // }

        // const updatedData = {
        //     username: newUsername || adminData.username,
        //     password: encryptText.encryptRC4(newPassword) || adminData.password,
        //     role: newRole || adminData.role
        // };

        // await newAdminRef.set(updatedData);
        // await adminRef.remove();

        const adminSnapshot = await adminAccRef.once('value');
        const adminInfo = await adminSnapshot.val();

        let exists = false;
        let adminKey;
        for(const key in adminInfo) {
            const admin = adminInfo[key];

            if(admin.username == currentUsername) {
                exists = true;
                adminKey = key;
                break;
            }
        }
        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }
        const updatedData = {
            username: newUsername || adminInfo[adminKey].username,
            password: encryptText.encryptRC4(newPassword) || adminInfo[adminKey].password,
            role: newRole || adminInfo[adminKey].role
        };
        await adminAccRef.child(adminKey).set(updatedData);

        await activityLogsRef.push(activityLogsCreator.createLogEditAdmin(req.session.admin.username, newUsername))

        return res.status(200).json({
            success: true,
            message: "Admin credentials updated successfully."
        });
    } catch (error) {
        console.error("Error updating admin credentials:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while updating admin credentials."
        });
    }

}

async function deleteAdminCredential(req, res) {
    const { username } = req.body;

    if(!username) {
        return res.status(400).json({
            success: false,
            message: "Username is required."
        });
    }

    try {
        // const adminRef = adminAccRef.child(username);
        // const adminData = (await adminRef.get()).val();

        // if (!adminData) {
        //     return res.status(404).json({
        //         success: false,
        //         message: "Admin not found."
        //     });
        // }

        // await adminRef.remove();
        const adminSnapshot = await adminAccRef.once('value');
        const adminInfo = await adminSnapshot.val();

        let exists = false;
        let adminKey;

        for(const key in adminInfo) {
            const admin = adminInfo[key];

            if(admin.username == username) {
                exists = true;
                adminKey = key;
                break;
            }
        }

        if (!exists) {
            return res.status(404).json({
                success: false,
                message: "Admin not found."
            });
        }
        await adminAccRef.child(adminKey).remove();

        await activityLogsRef.push(activityLogsCreator.createLogDeleteAdmin(req.session.admin.username, username))

        return res.status(200).json({
            success: true,
            message: "Admin account deleted successfully."
        });
    } catch (error) {
        console.error("Error deleting admin account:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while deleting the admin account."
        });
    }
}

async function createAdminCredential(req, res) {
    const { username, password, role } = req.body;

    const isFilled = Array.from([username, password, role]).every(value => value.trim() !== '');

    if(!isFilled){
        res.status(400).json({
            success : false,
            message : "All fields are required."
        })
    }

    try {
        // const existingAdmin = await adminAccRef.child(username).once("value");
        // if (existingAdmin.exists()) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "Username already exists."
        //     });
        // }

        // const encryptedPassword = encryptText.encryptRC4(password);
        // await adminAccRef.child(username).set({
        //     username,
        //     password: encryptedPassword,
        //     role
        // });
        const adminSnapshot = await adminAccRef.once("value");
        const adminInfo = await adminSnapshot.val()
        let exists = false;

        for(const key in adminInfo) {
            const admin = adminInfo[key];
            
        
            if(admin.username == username) {
                exists = true;
                break;
            }
        }
        if (exists) {
            return res.status(400).json({
                success: false,
                message: "Username already exists."
            });
        }

        const encryptedPassword = encryptText.encryptRC4(password);
        await adminAccRef.push({
            username,
            password: encryptedPassword,
            role
        });


        await activityLogsRef.push(activityLogsCreator.createLogAddAdmin(req.session.admin.username, username));

        return res.status(200).json({
            success: true,
            message: "Admin account created successfully."
        });
    } catch (error) {
        console.error("Error creating admin account:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while creating the admin account."
        });
    }
}


async function deleteLogs(req, res) {
    const {
        studentID,
        section,
        course,
        yearLevel,
        campus,
        startDate,
        endDate
    } = req.body;

    const isAllFieldsEmpty = Object.values(req.body).every(value => value === "");
    if (isAllFieldsEmpty) {
        return res.status(400).json({
        success: false,
        message: "At least one field is required to delete logs."
        });
    }

    try {
        const snapshot = await computerUsageLogsRef.get();
        if (!snapshot.exists()) {
        return res.status(404).json({
            success: false,
            message: "No logs found."
        });
        }

        const logsData = snapshot.val();

        
        let deletedCount = 0;

        for (const [studentId, studentLogs] of Object.entries(logsData)) {
            for (const [logId, log] of Object.entries(studentLogs)) {
                const shouldDelete = (
                (!studentID || log.studentID === studentID) &&
                (!section || log.section === section) &&
                (!course || log.course === course) &&
                (!yearLevel || log.yearLevel === yearLevel) &&
                (!campus || log.campus === campus) &&
                (!startDate || new Date(log.date) >= new Date(startDate)) &&
                (!endDate || new Date(log.date) <= new Date(endDate))
                );

                if (shouldDelete) {
                    await computerUsageLogsRef
                    .child(studentId)
                    .child(logId)
                    .remove();
                    deletedCount++;
                }
            }
        }

        await activityLogsRef.push(activityLogsCreator.createLogDeleteLogs(req.session.admin.username))
        return res.status(200).json({
            success: true,
            message: `${deletedCount} log(s) deleted successfully.`
        });
    } catch (err) {
        console.error("Error deleting logs:", err);
        return res.status(500).json({
        success: false,
        message: "An error occurred while deleting logs."
        });
    }
}

async function changePCPassword(req, res) {
    const { pcPassword } = req.body;

    if (!pcPassword) {
        return res.status(400).json({
            success: false,
            message: "New password is required."
        });
    }

    try {
        await pcPasswordRef.set({ password: pcPassword });
        await activityLogsRef.push(activityLogsCreator.createLogChangePCPassword(req.session.admin.username, pcPassword));
        return res.status(200).json({
            success: true,
            message: "PC password changed successfully."
        });
    } catch (error) {
        console.error("Error changing PC password:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while changing the PC password."
        });
    }
}


module.exports = { connectToMongoDB, checkStudentIdAvailability, registerAccount, login, createResetPassDoc, deleteResetPassDocs, compareResetCode, changePassword, insertCorrectionRequest, getAllLogs, updatePersonalInfo, updatePassword, deleteStudent, findAndPushData, findStudentID, getFilteredLogs, adminApproveModifyLogs, adminRejectModifyLogs, uploadEligibleStudentIDS, adminLogin, checkEligibility, editAdminCredentials, deleteAdminCredential, createAdminCredential, deleteLogs, changePCPassword,  };


