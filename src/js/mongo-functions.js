require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const mongoURI = process.env.MongoURI;
const Mailjet = require('node-mailjet');






const studentIDPassSchema = new mongoose.Schema({
    studentID : String,
    password : {
        type: String,
        required : false
    }
});

const studentIDPassModel = mongoose.model('studentidspasswords', studentIDPassSchema);

const registerInputSchema = new mongoose.Schema({
    studentID : String,
    password : String,
    confirmPassword : String,
    name : String,
    section : String,
    email : String,
    agreePolicy : Boolean
});

const registerInputModel = mongoose.model('accounts', registerInputSchema);

const emailSchema = new mongoose.Schema({
    email : String
})

const emailModel = mongoose.model('emails', emailSchema);

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



async function connectToMongoDB() {
    try {
        await retryMongoConnection(mongoURI); 
    } catch (err) {
        console.error('Failed to connect to MongoDB after retries:');
        process.exit(1); 
    }
}

function checkStudentIdAvailability(res, req) {
    
    let check = async () => {
        const { studentID } = req.body; 
        if (!studentID) {
                return res.status(400).json({ 
                    available : false,
                    message: 'Student ID is required.' 
                });
        }
        try {
            const existingUser = await retryWithExponentialDelay(() => studentIDPassModel.findOne({ studentID }));
    
            if (existingUser) {
                return res.json({ 
                    available: false,
                    message: 'Student ID already exists.'
                });
            } 
            else {
                return res.json({ 
                    available: true 
                });
            }
        } 
    
        catch (error) {
            console.error('CheckingStudentidERR', error);
            res.status(500).json({
                available : false,
                message : "Student ID availability check failed. Please try again."
            });
        }
    }
    retryWithExponentialDelay(check);
}

function registerAccount(res, req) {
    let register = async () => {
        const { studentID, password, confirmPassword, name, section, email, agreePolicy } = req.body;
    
        
        if (!studentID || !password || !confirmPassword || !name || !section || !email || !agreePolicy) {
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
            const existingEmail = await retryWithExponentialDelay(() => emailModel.findOne({
                email: email
            }));

            if(existingEmail) {
                return res.status(400).json({
                    successRegistration: false,
                    message: "Email already exists. Please try another email.",
                })
            }


            const existingStudent = await retryWithExponentialDelay(() => studentIDPassModel.findOne({ studentID }));
            if (existingStudent) {
                return res.status(400).json({
                    successRegistration: false,
                    message: "Student ID already exists.",
                });
            }

            
            const hashedPassword = await retryWithExponentialDelay(() => bcrypt.hash(password, 10)); 

            const account = await retryWithExponentialDelay(() => registerInputModel.create({
                studentID: studentID,
                password: hashedPassword,
                confirmPassword: hashedPassword,  
                name: name,
                section: section,
                email: email,
                agreePolicy: agreePolicy
            }));

            
            const newStudentID = await retryWithExponentialDelay(() => studentIDPassModel.create({
                studentID: studentID,
                password: hashedPassword
            }));

            const newEmail = await retryWithExponentialDelay(() => emailModel.create({
                email: email
            }))

            if (newStudentID && account && newEmail) {
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
        const {studentID, password} = req.body;
        if(!studentID || !password) {
            return res.status(400).json({
                successLogin: false,
                message: "Please enter both student ID and password.",
            })
        }

        try {
            const user = await retryWithExponentialDelay(() => studentIDPassModel.findOne({studentID}));

            if(!user) {
                console.log(user)
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

            res.status(200).json({
                successLogin: true,
                message: "Login successful."
            });

        }
        catch (error) {
            console.log(`LoginERR: ${error}`)
            res.status(500).json({
                successLogin: false,
                message: "Login failed. Please try again."
            });
        }
    };
    login();
}

async function createResetPassDoc(req, res) {
    let { email } = req.body;

    
    const resetCode = Math.floor(100000 + Math.random() * 900000);
    const expirationTime = Date.now() + 5 * 60 * 1000;
    try {
        if (!email) {
            throw new Error("Please provide an email.")
        }
        let existingEmail = await retryWithExponentialDelay(() => 
            emailModel.findOne({
                email : email
            })
        );

        if(!existingEmail) {
            throw new Error("The email you entered is not found in our database.")
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
        console.log(createResetDoc)
        return res.status(200).json({
            success: true,
            message: "Reset password document created successfully.",
            resetCode: resetCode,
            email : email,
            expirationTime: expirationTime, 
        }); 
        
        // throw new Error("The email you entered is not found in our database.")
        
    } 
    catch (error) {
        console.log(`CreationResetPassDocsERR: ${error}`)
        return res.status(400).json({
            success: false,
            message: error.message
        })
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
        console.log(deleteSuccess)
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
        // Check if all necessary fields are provided
        if (!email || !resetCode) {
            throw new Error('Inputs are empty.');
        }

        // Find the latest reset password document for the email and reset code
        const latestResetPassDoc = await retryWithExponentialDelay(() => resetRecordModel.findOne({
            email: email,
            resetCode: resetCode,
        }));

        // Check if the document exists
        if (!latestResetPassDoc) {
            throw new Error("The reset code doesn't match our records.");
        }

        // Compare expirationTime with the current date
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


module.exports = { connectToMongoDB, checkStudentIdAvailability, registerAccount, login, createResetPassDoc, deleteResetPassDocs, compareResetCode };
