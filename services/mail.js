require('dotenv').config();
const nodemailer = require('nodemailer');

function sendEmail(token, to = 'recipient@example.com') {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });

    // Sample email data
    const mailOptions = {
        from: process.env.EMAIL_FROM || 'admin@feha.io',
        to: to,
        subject: 'Your Download Link',
        text: `Here's your download link: https://staging2.feha.io/new-download/?token=${token}\n\nThis link is valid for 30 days.`,
        html: `
            <p>Hello,</p>
            <p>Here's your download link:</p>
            <p><a href="https://staging2.feha.io/new-download/?token=${token}">Click here to download</a></p>
            <p>If the link doesn't work, copy and paste this URL into your browser:</p>
            <p>https://staging2.feha.io/new-download/?token=${token}</p>
            <p>This link is valid for 30 days. Please download your file within this time.</p>
            <p>Best regards,<br>The Feha Team</p>
        `
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error);
        } else {
            console.log('Email sent successfully:', info.response);
        }
    });
};

// sendEmail('initoken', 'aep.stmik@gmail.com');


module.exports = {
    sendEmail
};