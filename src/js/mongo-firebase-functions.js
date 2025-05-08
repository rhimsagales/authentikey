require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const mongoURI = process.env.MongoURI;
const { getCorrectionRequestRef, getComputerUsageLogsRef, getEligibleStudentsRef } = require("../../firebase-config");
const admin = require('firebase-admin');





let correctionRequestRef = getCorrectionRequestRef();
let computerUsageLogsRef = getComputerUsageLogsRef();
let eligibleStudentsRef = getEligibleStudentsRef();



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
        const user = await retryWithExponentialDelay(() => flexibleModel.findOne({ studentID }));

        if (!user) {
            
            return res.status(400).json({
                successLogin: false,
                message: "The student ID is not registered in the database."
            });
        }

        
        
        req.session.user = user.toObject();
        
    } catch (error) {
        console.log(`LoginERR: ${error}`);
        res.status(500).json({
            successLogin: false,
            message: "Login failed. Please try again."
        });
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
    console.log(req.body);

    if (!studentIDS || studentIDS.length === 0) { 
        return res.status(400).json({
            message: "Please provide Student IDs."
        });
    }

    try {
        const updates = {};
        for (const id of studentIDS) {
            const newKey = eligibleStudentsRef.push().key; 
            updates[`/${newKey}`] = id;
        }
        await eligibleStudentsRef.update(updates); 

        return res.status(200).json({ message: "Student IDs uploaded successfully." });

    } catch (error) {
        console.error("Error uploading Student IDs:", error); 
        return res.status(500).json({
            message: "An error occurred while uploading the Student IDs. Please try again later."
        });
    }
}
module.exports = { connectToMongoDB, checkStudentIdAvailability, registerAccount, login, createResetPassDoc, deleteResetPassDocs, compareResetCode, changePassword, insertCorrectionRequest, getAllLogs, updatePersonalInfo, updatePassword, deleteStudent, findAndPushData, findStudentID, getFilteredLogs, adminApproveModifyLogs, adminRejectModifyLogs, uploadEligibleStudentIDS};
