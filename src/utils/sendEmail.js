// src/utils/sendEmail.js
const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        secure: true, 
        auth: {
            user: process.env.MAIL_USER,
            pass: process.env.MAIL_PASS,
        },
    });

    const mailOptions = {
        from: `Seek Platform <${process.env.MAIL_USER}>`,
        to: options.email,
        subject: options.subject,
        text: options.message,
        html: options.html 
    };

    await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;