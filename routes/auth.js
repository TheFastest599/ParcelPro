const express = require('express');
const User = require('../models/User');
const Member = require('../models/Member');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const mailSender = require('../assets/mail.main.template');
require('dotenv').config();

const Note = require('../models/Note');
const Todo = require('../models/Todo');
const Reminder = require('../models/Reminder');
let mailOptions = {
  from: `"ParcelPro" <${process.env.EMAIL}>`,
  to: '',
  subject: '',
  text: '',
  title: '',
  message: '',
  dateTimeLocalString: '',
};

const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET;

// User---------------------------------------------------------------------

//Route 1: Create a User using : POST "/api/auth/createuser" . No login required
router.post(
  '/createcustomer',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password atleast 5 characters').isLength({ min: 5 }),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      // Check whether the user with this email exists already
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: 'Sorry a user with this email already exists.',
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Create a new user
      user = await User.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
      });
      const data = {
        id: user.id,
      };
      success = true;
      const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '30d' });
      // mailOptions.to = req.body.email;
      // mailOptions.subject = 'Welcome to MyNotebook';
      // mailOptions.text = 'Welcome to MyNotebook';
      // mailOptions.title =
      //   'Embark on Your Productivity Journey with MyNotebook!';
      // mailOptions.message = `Hello ${req.body.name}! 🚀<br/>Welcome to MyNotebook –
      //  your personal haven for notes, todos, and reminders. We're excited to have
      //   you on board! This is where your thoughts take shape and your tasks find order.
      //   Explore, create, and stay organized effortlessly. If you ever need a helping hand
      //   or have questions, we're here for you. Happy note-taking and task conquering!`;
      // mailSender(mailOptions);
      res.json({
        success,
        authToken,
        name: req.body.name,
        email: req.body.email,
      });

      // res.json(user);
      // Catch error
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal server Error');
    }
  }
);

//Route 2: Authenticate a user using : POST "/api/auth/customerlogin" No login required
router.post(
  '/customerlogin',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: 'Please try to login with correct credentials' });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: 'Please try to login with correct credentials',
        });
      }
      const data = {
        id: user.id,
      };

      const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '30d' });
      success = true;
      res.json({ success, authToken, name: user.name, email: user.email });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal server Error');
    }
  }
);

//Route 3: Get loggedIn user details : POST "/api/auth/getuser"  login required
router.post('/getuser', fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await User.findById(userId).select('-password');
    if (user) {
      res.send(user);
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server Error');
  }
});

// ------------------------------------------------------------------------------
// Route 4: Request password reset : POST "/api/auth/forgotpassword"
// router.post('/forgotpassword', async (req, res) => {
//   let success = false;
//   try {
//     // 1. Get user based on POSTed email
//     const user = await User.findOne({ email: req.body.email });
//     if (!user) {
//       return res
//         .status(404)
//         .json({ success, error: 'No user found with that email.' });
//     }

//     // 2. Generate the random reset token
//     const resetToken = jwt.sign({ _id: user._id }, JWT_SECRET, {
//       expiresIn: '10m',
//     });

//     // 3. Send it to user's email
//     try {
//       const resetURL = `${req.body.clientUrl}/reset_password/${resetToken}`;
//       mailOptions.to = req.body.email;
//       mailOptions.subject = 'reset password';
//       mailOptions.text =
//         'To Reset your password for MyNotebook, click on link below.';
//       mailOptions.title = 'Reset Password';
//       mailOptions.message = `To Reset your password for MyNotebook, <a
//       href=${resetURL}
//       style="
//         text-decoration: none;
//         color: #0000ee;
//       "
//       >Click Here</a>.<br/> The link is valid for 10 minutes.`;
//       mailSender(mailOptions);

//       res.status(200).json({
//         success: true,
//         message: 'Password reset token sent to email!',
//       });
//     } catch (err) {
//       return res.status(500).json({
//         success,
//         message: 'There was an error sending the email. Try again later!',
//       });
//     }
//   } catch (err) {
//     res.status(500).json({ success, error: 'Error processing request.' });
//   }
// });

// // Route 5: Reset Password : POST "/api/auth/resetpassword"
// router.post('/resetpassword', async (req, res) => {
//   let success = false;
//   const { resetToken, password } = req.body;
//   if (!resetToken || !password) {
//     return res.status(400).json({
//       success,
//       error: 'All fields are required.',
//     });
//   }
//   try {
//     const decoded = jwt.verify(resetToken, JWT_SECRET);
//     const user = await User.findById(decoded._id);
//     if (!user) {
//       return res.status(401).json({
//         success,
//         error: 'Invalid token or it is expied.',
//       });
//     }
//     const salt = await bcrypt.genSalt(10);
//     const secPass = await bcrypt.hash(password, salt);
//     user.password = secPass;
//     await user.save();
//     success = true;
//     res.status(200).json({
//       success,
//       message: 'Password updated successfully!',
//     });
//   } catch (err) {
//     return res.status(500).json({
//       success,
//       error: 'Something went wrong. Please try again later.',
//     });
//   }
// });

// //Route 6: Checck loggedIn user details : POST "/api/auth/checkuserpass"  login required
// router.post('/checkuserpass', fetchuser, async (req, res) => {
//   try {
//     let userId = req.user.id;
//     const { password } = req.body;
//     let success = false;
//     const user = await User.findById(userId);
//     const passwordCompare = await bcrypt.compare(password, user.password);
//     if (user) {
//       if (passwordCompare) {
//         success = true;
//         // If password is correct
//         res.json({ success, message: 'Password is correct' });
//       } else {
//         res.status(400).json({ success, error: 'Password is incorrect' });
//       }
//     } else {
//       res.status(404).send('User not found');
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal server Error');
//   }
// });

// //Route 7: Delete User : POST "/api/auth/deleteuser"  login required
// router.delete('/deleteuser', fetchuser, async (req, res) => {
//   try {
//     let userId = req.user.id;
//     const { password } = req.body;
//     let success = false;
//     const user = await User.findById(userId);
//     const passwordCompare = await bcrypt.compare(password, user.password);
//     if (user) {
//       if (passwordCompare) {
//         success = true;
//         // Get all notes,todos and reminders ready for deletion
//         const notes = await Note.find({ user: req.user.id });
//         const todos = await Todo.find({ user: req.user.id });
//         const reminders = await Reminder.find({ user: req.user.id });
//         await User.findByIdAndDelete(userId);
//         notes.forEach(async note => {
//           await Note.findByIdAndDelete(note._id);
//         });
//         todos.forEach(async todo => {
//           await Todo.findByIdAndDelete(todo._id);
//         });
//         reminders.forEach(async reminder => {
//           await Reminder.findByIdAndDelete(reminder._id);
//         });
//         // Send success deleted message
//         res.json({
//           success,
//           message: 'User deleted',
//         });
//         console.log('User deleted');
//         // Send the user email about successfull account deletion
//         mailOptions.to = user.email;
//         mailOptions.subject = 'Goodbye from MyNotebook';
//         mailOptions.text = 'Goodbye from MyNotebook';
//         mailOptions.title = `Successfully deleted ${user.name}'s account from MyNotebook`;
//         mailOptions.message = `We're sad to see you go but we understand that goodbyes are a part of the journey.
// Thank you for being a part of MyNotebook. Your presence added to the essence of what we've built.
// Remember, your notes, todos, and reminders always have a home here. Should you decide to return,
// we'll welcome you back with open arms. Until then, we wish you all the best on your journey ahead.
// Farewell, and may your days be filled with organization and productivity! 🌟`;
//         mailSender(mailOptions);
//       } else {
//         res.status(400).json({ success, error: 'Password is incorrect' });
//       }
//     } else {
//       res.status(404).send('User not found');
//     }
//   } catch (error) {
//     console.log(error);
//     res.status(500).send('Internal server Error');
//   }
// });

// -------------------------------------------------------------------------

// Member------------------------------------------------------------------------

//Route 8: Create a Member using : POST "/api/auth/createmember" . No login required
router.post(
  '/createmember',
  [
    body('name', 'Enter a valid name').isLength({ min: 3 }),
    body('email', 'enter a valid email').isEmail(),
    body('password', 'password atleast 5 characters').isLength({ min: 5 }),
    body('memberType', 'Enter a valid memberType').exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    try {
      // Check whether the member with this email exists already
      let user = await Member.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success,
          error: 'Sorry a member with this email already exists.',
        });
      }
      const salt = await bcrypt.genSalt(10);
      const secPass = await bcrypt.hash(req.body.password, salt);
      // Create a new member
      user = await Member.create({
        name: req.body.name,
        password: secPass,
        email: req.body.email,
        memberType: req.body.memberType,
      });
      const data = {
        id: user.id,
      };
      success = true;
      const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '30d' });
      // mailOptions.to = req.body.email;
      // mailOptions.subject = 'Welcome to MyNotebook';
      // mailOptions.text = 'Welcome to MyNotebook';
      // mailOptions.title =
      //   'Embark on Your Productivity Journey with MyNotebook!';
      // mailOptions.message = `Hello ${req.body.name}! 🚀<br/>Welcome to MyNotebook –
      //  your personal haven for notes, todos, and reminders. We're excited to have
      //   you on board! This is where your thoughts take shape and your tasks find order.
      //   Explore, create, and stay organized effortlessly. If you ever need a helping hand
      //   or have questions, we're here for you. Happy note-taking and task conquering!`;
      // mailSender(mailOptions);
      res.json({
        success,
        authToken,
        name: req.body.name,
        email: req.body.email,
        memberType: req.body.memberType,
        engaged: user.engaged,
        packageId: user.packageId,
      });

      // res.json(user);
      // Catch error
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal server Error');
    }
  }
);

//Route 2: Authenticate a user using : POST "/api/auth/memberlogin" No login required
router.post(
  '/memberlogin',
  [
    body('email', 'Enter a valid email').isEmail(),
    body('password', 'Password cannot be blank').exists(),
    body('memberType', 'Enter valid member type').exists(),
  ],
  async (req, res) => {
    let success = false;
    // If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success, errors: errors.array() });
    }
    const { email, password, memberType } = req.body;
    try {
      let user = await Member.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ error: 'Please try to login with correct credentials' });
      }
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res.status(400).json({
          success,
          error: 'Please try to login with correct credentials',
        });
      }
      if (user.memberType !== memberType) {
        return res.status(400).json({
          success,
          error: 'Please try to login with correct credentials and member type',
        });
      }
      const data = {
        id: user.id,
      };

      const authToken = jwt.sign(data, JWT_SECRET, { expiresIn: '30d' });
      success = true;
      res.json({
        success,
        authToken,
        name: user.name,
        email: user.email,
        memberType: user.memberType,
        engaged: user.engaged,
        packageId: user.packageId,
      });
    } catch (error) {
      console.log(error.message);
      res.status(500).send('Internal server Error');
    }
  }
);

module.exports = router;
