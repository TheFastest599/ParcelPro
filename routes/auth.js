const express = require('express');
const User = require('../models/User');
const Member = require('../models/Member');
const Package = require('../models/Package');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');
const mailSender = require('../assets/mail.main.template');
const emailExistence = require('email-existence');

require('dotenv').config();

const client = process.env.CLIENT_URL;

let mailOptions = {
  from: `"ParcelPro" <${process.env.EMAIL}>`,
  to: '',
  subject: '',
  title: '',
  message: '',
  priority: 'high',
};

const { body, validationResult } = require('express-validator');

const JWT_SECRET = process.env.JWT_SECRET;

function checkEmail(email) {
  return new Promise((resolve, reject) => {
    emailExistence.check(email, function (error, response) {
      if (error) {
        reject(error);
      } else {
        resolve(response);
      }
    });
  });
}

async function getEmailResponse(email) {
  try {
    const response = await checkEmail(email);
    return response;
  } catch (error) {
    return false;
  }
}

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
      let [user, emailResponse] = await Promise.all([
        User.findOne({ email: req.body.email }),
        getEmailResponse(req.body.email),
      ]);
      // let user = await User.findOne({ email: req.body.email });
      if (!emailResponse) {
        return res.status(400).json({
          success,
          error: 'Please enter a valid email address.',
        });
      }
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

      // Send welcome email to user
      mailOptions.to = req.body.email;
      mailOptions.subject = 'Welcome to ParcelPro';
      mailOptions.title = 'Welcome to ParcelPro!';
      mailOptions.message = `
        <p>Hello ${user.name},</p>
        <p>Welcome to <strong>ParcelPro</strong> – your ultimate solution for efficient and reliable courier management. We're thrilled to have you on board!</p>
        <p>At ParcelPro, we are dedicated to providing you with the best tools and services to manage your shipments seamlessly. Here’s what you can expect:</p>
        <ul>
          <li><strong>Real-time Tracking:</strong> Keep an eye on your parcels with our real-time tracking feature.</li>
          <li><strong>Efficient Management:</strong> Easily manage your shipments, schedules, and deliveries.</li>
          <li><strong>Reliable Support:</strong> Our support team is here to assist you with any questions or concerns.</li>
        </ul>
        <p>We are committed to making your courier management experience as smooth and hassle-free as possible. If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
        <p>Thank you for choosing ParcelPro. We look forward to serving you!</p>
        <p>Best regards,</p>
        <p><strong>Team ParcelPro</strong></p>
      `;

      mailSender(mailOptions);
      //---------------------------------------------------------------
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

      user.lastLogin = Date.now();
      user.save();

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
// Route 4: Request password reset : POST "/api/auth/userforgotpassword"
router.post('/userforgotpassword', async (req, res) => {
  try {
    // 1. Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).send('No user found with that email.');
    }

    // 2. Generate the random reset token
    const resetToken = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '10m',
    });

    // 3. Send it to user's email
    try {
      const resetURL = `${
        client.startsWith('localhost') ? 'http://' : 'https://'
      }/customer/reset_password/${resetToken}`;
      mailOptions.to = user.email;
      mailOptions.subject = 'Password Reset Request';
      mailOptions.title = 'Password Reset';
      mailOptions.message = `
        <p>Hello ${user.name},</p>
        <p>We received a request to reset your password for your ParcelPro account. If you did not make this request, please ignore this email.</p>
        <p>To reset your password, please click on the link below:</p>
        <p><a href="${resetURL}" style="color: #007bff; text-decoration: none;">Reset Password</a></p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
        <p>Thank you for using ParcelPro!</p>
        <p>Best regards,</p>
        <p><strong>Team ParcelPro</strong></p>
      `;

      mailSender(mailOptions);

      res.status(200).json({
        message: 'Password reset link sent to email!',
      });
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Error sending email. Please try again later.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route 5: Reset Password : POST "/api/auth/userresetpassword"
router.post('/userresetpassword', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({
      error: 'All fields are required.',
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid token or it is expied.',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    user.password = secPass;
    await user.save();
    success = true;
    res.status(200).json({
      message: 'Password updated successfully!',
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Something went wrong. Please try again later.',
    });
  }
});

// -------------------------------------------------------------------------

// Member------------------------------------------------------------------------

//Route 1: Create a Member using : POST "/api/auth/createmember" . No login required
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
      // let user = await Member.findOne({ email: req.body.email });
      let [user, emailResponse] = await Promise.all([
        Member.findOne({ email: req.body.email }),
        getEmailResponse(req.body.email),
      ]);
      if (!emailResponse) {
        return res.status(400).json({
          success,
          error: 'Please enter a valid email address.',
        });
      }
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

      // Send welcome email to member
      mailOptions.to = req.body.email;
      mailOptions.subject = 'Welcome to ParcelPro';
      mailOptions.title = 'Welcome to ParcelPro!';
      mailOptions.message = `
        <p>Hello ${user.name} <strong>(${user.memberType})</strong>,</p>
        <p>Welcome to <strong>ParcelPro</strong> – your ultimate solution for efficient and reliable courier management. We're thrilled to have you as a part of our team!</p>
        <p>As a valued member of our company, you play a crucial role in ensuring that our operations run smoothly and our customers are satisfied. Here’s what you can expect:</p>
        <ul>
          <li><strong>Real-time Tracking:</strong> Monitor the status of packages and ensure timely deliveries.</li>
          <li><strong>Efficient Management:</strong> Manage shipments, schedules, and deliveries with ease.</li>
          <li><strong>Reliable Support:</strong> Our support team is here to assist you with any questions or concerns.</li>
        </ul>
        <p>We are committed to making your experience with ParcelPro as smooth and hassle-free as possible. If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
        <p>Thank you for joining ParcelPro. We look forward to working with you!</p>
        <p>Best regards,</p>
        <p><strong>Team ParcelPro</strong></p>
      `;

      mailSender(mailOptions);
      //---------------------------------------------------------------
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

      // Update last login date
      user.lastLogin = Date.now();
      user.save();

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

//Route 3: Get all members : POST "/api/auth/getmembers"  login required
router.post('/getmembers', fetchuser, async (req, res) => {
  try {
    let userId = req.user.id;
    const user = await Member.findById(userId).select('-password');
    if (!user.memberType === 'admin') {
      return res.status(403).send('Unauthorized');
    }
    const members = await Member.find().select('-password');
    for (let i = 0; i < members.length; i++) {
      if (members[i].engaged) {
        const package = await Package.findById(members[i].packageId);
        if (package) {
          members[i] = { ...members[i]._doc, trackID: package.trackID };
        }
      }
    }
    res.send(members);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server Error');
  }
});

// Route 4: Request password reset : POST "/api/auth/memberforgotpassword"
router.post('/memberforgotpassword', async (req, res) => {
  try {
    // 1. Get user based on POSTed email
    const user = await Member.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ error: 'No user found with that email.' });
    }

    // 2. Generate the random reset token
    const resetToken = jwt.sign({ _id: user._id }, JWT_SECRET, {
      expiresIn: '10m',
    });

    // 3. Send it to user's email
    try {
      const resetURL = `${
        client.startsWith('localhost') ? 'http://' : 'https://'
      }company/reset_password/${resetToken}`;
      mailOptions.to = user.email;
      mailOptions.subject = 'Password Reset Request';
      mailOptions.title = 'Password Reset';
      mailOptions.message = `
        <p>Hello ${user.name} <strong>(${user.memberType})</strong>,</p>
        <p>We received a request to reset your password for your ParcelPro account. If you did not make this request, please ignore this email.</p>
        <p>To reset your password, please click on the link below:</p>
        <p><a href="${resetURL}" style="color: #007bff; text-decoration: none;">Reset Password</a></p>
        <p>This link will expire in 10 minutes.</p>
        <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
        <p>Thank you for using ParcelPro!</p>
        <p>Best regards,</p>
        <p><strong>Team ParcelPro</strong></p>
      `;

      mailSender(mailOptions);

      res.status(200).json({
        message: 'Password reset link sent to email!',
      });
    } catch (err) {
      return res
        .status(500)
        .json({ error: 'Error sending email. Please try again later.' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Route 5: Reset Password : POST "/api/auth/memberresetpassword"
router.post('/memberresetpassword', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({
      error: 'All fields are required.',
    });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await Member.findById(decoded._id);
    if (!user) {
      return res.status(401).json({
        error: 'Invalid token or it is expied.',
      });
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(password, salt);
    user.password = secPass;
    await user.save();
    success = true;
    res.status(200).json({
      message: 'Password updated successfully!',
    });
  } catch (err) {
    return res.status(500).json({
      error: 'Something went wrong. Please try again later.',
    });
  }
});

module.exports = router;
