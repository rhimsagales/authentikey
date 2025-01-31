const mongoFunctions = require('./src/js/mongo-functions')
require('dotenv').config();
const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');
const app = express();
// const emailjs = require('emailjs-com');
const axios = require('axios');




app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'src')));


mongoFunctions.connectToMongoDB();




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
    mongoFunctions.checkStudentIdAvailability(res, req);
});

app.post('/pages/sign-up/register-account', async (req, res) => {
    mongoFunctions.registerAccount(res, req);
});

app.post('/pages/sign-in/login', async(req, res) => {
    mongoFunctions.login(req, res);
})

app.post('/pages/sign-in/login/send-code', async (req, res) => {
    mongoFunctions.createResetPassDoc(req, res);
    
})

app.delete('/pages/sign-in/login/delete-code', async(req, res) => {
    mongoFunctions.deleteResetPassDocs(req, res);
})
app.post('/pages/sign-in/login/verify-code', async(req, res) => {
    mongoFunctions.compareResetCode(req, res);
})

app.listen(3000, () => {
    console.log('Server running at http://localhost:3000');
});
