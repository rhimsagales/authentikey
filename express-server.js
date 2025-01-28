const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));


const mongoURI = 'mongodb+srv://yeqiujinwoo:yFp8xWOKzptnhYfS@authentikey.ymztx.mongodb.net/authentikeyDB?retryWrites=true&w=majority&appName=authentikey';


mongoose.connect(mongoURI)
.then(() => {
    console.log('Connected to MongoDB');
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});


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



app.get('/', (req, res) => {
    res.send('Server is online.');
});

app.get('/pages/:name', (req, res) => {
    const pageName = req.params.name;
    res.sendFile(path.join(__dirname, `src/pages/${pageName}.html`));
});

app.get('/users/dashboard', (req, res) => {
    res.send('Dashboard');
})

app.post('/pages/sign-up/check-studentid-availability', async (req, res) => {
    const { studentID } = req.body; 

    if (!studentID) {
        return res.status(400).json({ 
            available : false,
            message: 'Email is required.' 
        });
    }

    try {
        const existingUser = await studentIDPassModel.findOne({ studentID });

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
});

app.post('/pages/sign-up/register-account', async (req, res) => {
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
        
        const existingStudent = await studentIDPassModel.findOne({ studentID });
        if (existingStudent) {
            return res.status(400).json({
                successRegistration: false,
                message: "Student ID already exists.",
            });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10); 

        const account = await registerInputModel.create({
            studentID: studentID,
            password: hashedPassword,
            confirmPassword: hashedPassword,  
            name: name,
            section: section,
            email: email,
            agreePolicy: agreePolicy
        });

        
        const newStudentID = await studentIDPassModel.create({
            studentID: studentID,
            password: hashedPassword
        });

        if (newStudentID && account) {
            res.status(201).json({
                successRegistration: true,
                message: "Registration completed successfully."
            });
        }
    } catch (error) {
        console.error('RegisterERR:', error);
        res.status(500).json({
            successRegistration: false,
            message: "Registration failed. Please try again.",
        });
    }
});

app.post('/pages/sign-in/login', async(req, res) => {
    const {studentID, password} = req.body;
    if(!studentID || !password) {
        return res.status(400).json({
            successLogin: false,
            message: "Please enter both student ID and password.",
        })
    }

    try {
        const user = await studentIDPassModel.findOne({studentID});

        if(!user) {
            console.log(user)
            return res.status(400).json({
                successLogin: false,
                message: "The student ID is not registered in the database."
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
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
})



app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
