const { SMTPClient } = require("emailjs");
require("dotenv").config();


const client = new SMTPClient({
    user: process.env.EmailJsPublic,  
    password: process.env.EmailJsPrivate,  
    host: 'smtp.emailjs.com',
    ssl: true
});

module.exports = client;
