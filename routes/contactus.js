require('dotenv').config();
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const mailSender = require('../assets/mail.main.template');

let mailOptions = {
  from: `MyNotebook <${process.env.EMAIL}>`,
  to: process.env.EMAIL_CREATOR,
  subject: 'Feedback',
  text: '',
  title: 'Feedback',
  message: '',
  dateTimeLocalString: '',
};

const { body, validationResult } = require('express-validator');

// Route Contact Us - POST /api/contactus
router.post(
  '/',
  [
    body('name', 'Enter a name').isLength({ min: 1 }),
    body('message', 'Message must be atleast 3 characters').isLength({
      min: 1,
    }),
  ],
  async (req, res) => {
    let success = false;

    try {
      // If there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success, errors: errors.array() });
      }
      const { name, email, message } = req.body;
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: email }).select('-password');
      if (!user) {
        return res.status(400).json({
          success,
          error: 'Sorry a user with this email doesnot exists.',
        });
      }
      mailOptions.text = `Feedback from ${name}`;
      mailOptions.message = `Feedback from <br/>Name : ${name}<br/>Email : ${email}<br/>Message : ${message}`;
      if (await mailSender(mailOptions)) {
        console.log('Feedback email sent successfully');
        success = true;
        res.json({
          success,
          message: 'Your feedback has been sent successfully!',
        });
      } else {
        console.log('Error sending feedback email');
        success = false;
        res.json({
          success,
          error: 'We occured some problem!',
        });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server Error');
    }
  }
);

module.exports = router;
