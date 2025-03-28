require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const mongoURI = process.env.MongoURI;




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
    logs : { type: Array,  required: false},
    correctionRequest: { type: Array,  required: false}
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

    mongoose.connection.removeAllListeners('disconnected'); // Prevent duplicate listeners
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









async function checkStudentIdAvailability(req, res) {
    const { studentID } = req.body; 

    if (!studentID) {
        return res.status(400).json({ 
            available: false,
            message: 'Student ID is required.' 
        });
    }

    try {
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

function registerAccount(req, res) {
    let register = async () => {
        const { studentID, password, confirmPassword, name, section, email, course, yearLevel, agreePolicy } = req.body;
    
        if (!studentID || !password || !confirmPassword || !name || !section || !email || !course || !yearLevel || !agreePolicy) {
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

        try {
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
                agreePolicy: agreePolicy
            }));

            if (account) {
                res.status(201).json({
                    successRegistration: true,
                    message: "Registration completed successfully."
                });
            }
        } 
        catch (error) {
            console.error('RegisterERR:', error);
            res.status(500).json({
                successRegistration: false,
                message: "Registration failed. Please try again.",
            });
        }
    }

    register();
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
            // req.session.user = user.toObject();
            req.session.regenerate((err) => {
                if (err) {
                    console.error("Session regeneration failed:", err);
                    return res.status(500).send("Server error");
                }
                
                req.session.user = { id: user.id, role: user.role };
                req.session.studentID = user.toObject().studentID; // Reassign session data
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
    const { fullName, email, subject, dateRecord, correctionDetails } = req.body;

    try {
        if (!fullName || !email || !subject || !dateRecord || !correctionDetails) {
            console.log({
                fullName,
                email,
                subject,
                dateRecord,
                correctionDetails
            })
            return res.status(400).json({ success: false, message: 'All fields are required.' }); // More specific return
        }

        const user = await retryWithExponentialDelay(() => flexibleModel.findOne({ email })); // Use studentID consistently

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found.' }); // 404 for not found
        }

        const requestNumber = user.correctionRequest ? user.correctionRequest.length + 1 : 1; // Handle initial request

        const status = "";

        const correctionRequestObj = {
            requestNumber,
            fullName,
            email,
            subject,
            dateRecord,
            correctionDetails,
            status
            
        };

        const updatedDocument = await retryWithExponentialDelay(() => flexibleModel.findOneAndUpdate(
            { email : email },
            { $push: { correctionRequest: correctionRequestObj } },
            { new: true, useFindAndModify: false }
        ));

        if (!updatedDocument) {
            throw new Error('Failed to submit correction request.');
        }

        return res.status(200).json({ success: true, message: 'Correction request submitted successfully.' });

    } catch (error) {
        console.error("Error submitting correction request:", error); // Log the error for debugging
        return res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' }); // Generic error message for security
    }
}

async function updatePersonalInfo (req, res) {
    try {
        // Destructure req.body
        const { studentID, name, newStudentID, email, section, course, yearLevel } = req.body;
        
        // Validate required fields
        if (!name || !newStudentID || !email || !section || !course || !yearLevel) {
            return res.status(400).json({ message: "All fields are required." });
        }

        // Find student by studentID
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
        
        // Update fields
        student.name = name;
        student.email = email;
        student.section = section;
        student.course = course;
        student.yearLevel = yearLevel;
        student.studentID = newStudentID;
        
        // Save the updated document
        await student.save();

        return res.status(200).json({ message: "Student updated successfully. Please log in again.", student });
    } catch (error) {
        console.error(error);
        return res.status(400).json({ message: "Internal Server Error." });
    }
};


async function updatePassword (req, res) {
    try {
        // Destructure req.body
        const { password, studentID } = req.body;

        // Validate required fields
        if (!password || !studentID) {
            return res.status(400).json({ message: "All fields are required." });
        }

        

        // Find student by studentID
        const student = await flexibleModel.findOne({ studentID });
        if (!student) {
            return res.status(404).json({ message: "Student not found." });
        }

        // Hash new password
        const newHashedPass = await retryWithExponentialDelay(() => bcrypt.hash(password, 10));

        // Update password fields
        student.password = newHashedPass;
        student.confirmPassword = newHashedPass;

        // Save the updated document
        await student.save();

        return res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error." });
    }
};


async function deleteStudent  (req, res) {
    try {
        // Destructure req.body
        const { studentID } = req.body;

        // Validate required field
        if (!studentID) {
            return res.status(400).json({ message: "Student ID is required." });
        }

        // Find and delete student by studentID using retryWithExponentialDelay
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
        const { studentID, timeIn, timeOut, date, pcNumber } = req.body;

        // console.log("Raw request body:", req.body);

        if (!studentID || !timeIn || !timeOut || !date || !pcNumber) {
            return res.status(400).json({ error: "Missing required fields",
                body : req.body
             });
        }

        // Find the document by studentId
        const document = await retryWithExponentialDelay(() => flexibleModel.findOne({ studentID }));
        

        if (!document) {
            return res.status(404).json({ error: "Document not found" });
        }

        // Create log entry
        const newLog = { date : new Date(date), timeIn, timeOut, pcNumber };

        // Push new log entry to logs array
        document.logs.push(newLog);

        // Save the updated document
        await document.save();

        res.status(200).json({ message: "Log added successfully", updatedDocument: document });
    } catch (error) {
        console.error("Error updating document:", error);
        res.status(500).json({ error: "Internal Server Error" });
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





module.exports = { connectToMongoDB, checkStudentIdAvailability, registerAccount, login, createResetPassDoc, deleteResetPassDocs, compareResetCode, changePassword, insertCorrectionRequest, getAllLogs, updatePersonalInfo, updatePassword, deleteStudent, findAndPushData, findStudentID};
