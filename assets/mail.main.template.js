const HTML_TEMPLATE = require('./mail.html.template');
require('dotenv').config();
const nodemailer = require('nodemailer');
const { google } = require('googleapis'); // For OAuth2 form of email sending

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
// Async function to send email
const mailSender = async mailOptions => {
  try {
    // Generate the HTML content
    mailOptions.html = HTML_TEMPLATE(mailOptions.title, mailOptions.message);

    // Send the email
    const accessToken = await oAuth2Client.getAccessToken();
    // OAuth2 form of email sending
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465, // Use 587 if you want to force STARTTLS
      secure: true, // true for 465, false for other ports
      service: process.env.EMAIL_SERVICE,
      auth: {
        type: 'OAuth2',
        user: process.env.EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    let info = await transporter.sendMail(mailOptions);
    console.log('Email sent: via oAuth ' + info.response);
    return true;
  } catch (error) {
    console.error('Error sending email: ', error);
    return false;
  }
};

module.exports = mailSender;
