const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const fetchuser = require('../middleware/fetchuser');
const Package = require('../models/Package');
const Member = require('../models/Member');
const mailSender = require('../assets/mail.main.template');
require('dotenv').config();

let mailOptions = {
  from: `"ParcelPro" <${process.env.EMAIL}>`,
  to: '',
  subject: '',
  title: '',
  message: '',
  priority: 'high',
};

const client = process.env.CLIENT_URL;

const processDate = date => {
  const formattedDate = moment(date).tz('Asia/Kolkata').format('DD-MM-YYYY');
  const formattedTime = moment(date).tz('Asia/Kolkata').format('HH:mm');

  return `${formattedDate}, ${formattedTime}`;
};

// Route 1: Add a new package using: POST "/api/packages/add". Login required
router.post('/add', fetchuser, async (req, res) => {
  try {
    const temp = req.body;
    const package = new Package({
      ...temp,
      customer: req.user.id,
      lastUpdated: Date.now(),
    });
    // console.log(package);
    const savePackage = await package.save();
    res.json(savePackage);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Route 2: Get all the packages using: POST "/api/packages/all". Login required
router.post('/all', fetchuser, async (req, res) => {
  try {
    const value = req.body.value;
    if (value == 'admin') {
      const packages = await Package.find();
      res.json(packages);
    }
    if (value == 'customer') {
      const packages = await Package.find({ customer: req.user.id });
      res.json(packages);
    }
    if (value == 'driver') {
      const packages = await Package.find({ status: 'pending' });
      res.json(packages);
    }

    if (value == 'delivery partner') {
      const packages = await Package.find({ status: 'staged' });
      res.json(packages);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Route 3: Get a package using: POST "/api/packages/get". Login required
router.post('/get', fetchuser, async (req, res) => {
  try {
    const memberId = req.user.id;
    const packageId = req.body.packageId;
    const memberType = req.body.memberType;
    const package = await Package.findById(packageId);

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    if (memberType === 'driver') {
      if (package.transit && package.transit.driver == memberId) {
        res
          .status(200)
          .json({ message: 'Assigned package fetched', package: package });
      } else {
        res
          .status(403)
          .json({ message: 'You are not assigned to this package' });
      }
    }

    if (memberType === 'delivery partner') {
      if (package.delivery && package.delivery.deliveryPartner == memberId) {
        res
          .status(200)
          .json({ message: 'Assigned package fetched', package: package });
      } else {
        res
          .status(403)
          .json({ message: 'You are not assigned to this package' });
      }
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Route 4: Add a job using: POST "/api/packages/addjob". Login required
router.post('/addjob', fetchuser, async (req, res) => {
  try {
    const memberType = req.body.memberType;
    const memberId = req.user.id;
    const packageId = req.body.packageId;
    if (memberType == 'driver') {
      const package = await Package.findById(packageId);
      if (!package.transit) {
        package.transit = {}; // Initialize transit if it doesn't exist
      }
      package.transit.driver = memberId;
      if (package.status !== 'pending') {
        return res
          .status(403)
          .json({ message: 'Package is already assigned to someone' });
      }
      package.status = 'dispatched';
      package.lastUpdated = Date.now();
      // send user mail for dispatched
      const member = await Member.findById(memberId);
      member.engaged = true;
      member.packageId = packageId;
      package.transit.driverName = member.name;
      package.save();
      member.save();

      // Send package dispatched mail to user
      mailOptions.to = package.receiver.email;
      mailOptions.subject = 'Your Package is on the Way!';
      mailOptions.title = 'Package Dispatched';
      mailOptions.message = `
        <p>Hello ${package.receiver.name},</p>
        <p>We are excited to inform you that your package has been dispatched and will soon be in transit on its way to you.</p>
        <p>You can track the status of your package using the following link:</p>
        <p><a href="${
          client.startsWith('localhost') ? 'http://' : 'https://'
        }/track/${
        package.trackID
      }" style="color: #007bff; text-decoration: none;">Track Your Package</a></p>
        <p>Thank you for choosing ParcelPro. We hope you have a great experience with our service!</p>
        <p>Best regards,</p>
        <p><strong>Team ParcelPro</strong></p>
      `;
      mailSender(mailOptions);
      //---------------------------------------------------------------
      res.json({
        message: 'Job Assigned Successfully',
        package: package,
        member: member,
      });
    }
    if (memberType == 'delivery partner') {
      const package = await Package.findById(packageId);
      if (!package.delivery) {
        package.delivery = {}; // Initialize delivery if it doesn't exist
      }
      package.delivery.deliveryPartner = memberId;
      if (package.status !== 'staged') {
        return res
          .status(403)
          .json({ message: 'Package is already assigned to someone' });
      }
      package.delivery.otp = Math.floor(100000 + Math.random() * 900000);
      package.status = 'out';
      package.lastUpdated = Date.now();
      // console.log(package);
      // send user mail for out for delivery with otp
      const member = await Member.findById(memberId);
      member.engaged = true;
      member.packageId = packageId;
      package.delivery.deliveryPartnerName = member.name;
      package.save();
      member.save();

      // Send package out for delivery mail to user
      mailOptions.to = package.receiver.email;
      mailOptions.subject = 'Your Package is Out for Delivery';
      mailOptions.title = 'Package Out For Delivery';
      mailOptions.message = `
        <p>Hello ${package.receiver.name},</p>
        <p>We are excited to inform you that your package has been staged and will be out for delivery soon.</p>
        <p>You can track the status of your package using the following link:</p>
        <p><a href="${
          client.startsWith('localhost') ? 'http://' : 'https://'
        }/track/${
        package.trackID
      }" style="color: #007bff; text-decoration: none;">Track Your Package</a></p>
        <p>Your OTP for the package is: <strong>${
          package.delivery.otp
        }</strong></p>
        <p>Please provide this OTP to our delivery partner, <strong>${
          package.delivery.deliveryPartnerName
        }</strong>, to receive your package.</p>
        <p>Thank you for choosing ParcelPro. We hope you have a great experience with our service!</p>
        <p>Best regards,</p>
        <p><strong>Team ParcelPro</strong></p>
      `;
      mailSender(mailOptions);
      //---------------------------------------------------------------
      // console.log(member);
      res.json({
        message: 'Job Assigned Successfully',
        package: package,
        member: member,
      });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Route 5: Update a job using: POST "/api/packages/updatejob". Login required
router.post('/updatejob', fetchuser, async (req, res) => {
  try {
    const memberId = req.user.id;
    const memberType = req.body.memberType;
    const packageId = req.body.packageId;
    const package = await Package.findById(packageId);
    const date = Date.now();
    let driverReleived = false;

    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }

    if (
      memberType === 'driver' &&
      package.transit &&
      package.transit.driver == memberId
    ) {
      let data = req.body.data;
      const reachedDest = data.reachedDest;

      data = {
        location: data.location,
        description: data.description,
        date: date,
      };
      if (package.transit.status.length === 0) {
        package.status = 'transit';
      }
      package.transit.status.push(data);
      package.lastUpdated = date;

      if (reachedDest) {
        package.transit.reachedDest = reachedDest;
        package.status = 'staged';
      }
      package.save();
      let member = '';
      if (reachedDest) {
        member = await Member.findById(memberId).select('-packageId');
        member.engaged = false;
        member.packageId = '';
        member.save();
        driverReleived = true;
      }
      res.status(200).json({
        message: 'Package Transit status updated successfully.',
        package: package,
        member: driverReleived ? member : '',
        driverReleived: driverReleived,
      });
    } else if (
      memberType === 'delivery partner' &&
      package.delivery &&
      package.delivery.deliveryPartner == memberId
    ) {
      let data = req.body.data;
      const otp = parseInt(data.otp, 10);
      const check = otp === package.delivery.otp;
      // console.log(otp, package.delivery.otp, check);
      if (!data.deliveryFailed) {
        if (!check) {
          return res.status(403).json({ message: 'Invalid OTP' });
        }
        let member = await Member.findById(memberId).select('-packageId');
        if (check) {
          package.delivery.delivered = true;
          package.status = 'delivered';
          package.delivery.date = date;
          package.lastUpdated = date;
          package.save();
          member.engaged = false;
          member.packageId = '';
          member.save();
          driverReleived = true;
          // console.log(package, member);
        }
        // Send package delivered mail to sender
        mailOptions.to = package.sender.email;
        mailOptions.subject = 'Your Package has been Delivered!';
        mailOptions.title = 'Package Delivered';
        mailOptions.message = `
          <p>Hello ${package.sender.name},</p>
          <p>We are pleased to inform you that your package has been successfully delivered to ${
            package.receiver.name
          } on ${processDate(package.delivery.date)}.</p>
          <p>You can track the journey of your package using the following link:</p>
          <p><a href="${client}/track/${
          package.trackID
        }" style="color: #007bff; text-decoration: none;">Track Your Package</a></p>
          <p>Thank you for choosing ParcelPro. We hope you had a great experience with our service!</p>
          <p>Best regards,</p>
          <p><strong>Team ParcelPro</strong></p>
        `;

        mailSender(mailOptions);
        //---------------------------------------------------------------
        res.status(200).json({
          message: 'Package delivered successfully',
          package: package,
          member: check ? member : '',
          driverReleived: driverReleived,
        });
      }
      if (data.deliveryFailed) {
        const member = await Member.findById(memberId).select('-packageId');
        package.delivery.failed.deliveryFailed = true;
        package.delivery.failed.deliveryFailAction = data.deliveryFailAction;
        package.delivery.failed.description = data.description;
        package.delivery.date = date;
        package.status = 'failed';
        package.lastUpdated = date;
        package.save();
        member.engaged = false;
        member.packageId = '';
        member.save();
        // console.log(package, member);
        driverReleived = true;

        // Send package delivery failed mail to sender
        mailOptions.to = package.sender.email;
        mailOptions.subject = 'Your Package Delivery has Failed';
        mailOptions.title = 'Package Delivery Failed';
        mailOptions.message = `
          <p>Hello ${package.sender.name},</p>
          <p>We regret to inform you that the delivery of your package to ${
            package.receiver.name
          } has failed on ${processDate(package.delivery.date)}.</p>
          <p><strong>Action taken</strong>: ${
            package.delivery.failed.deliveryFailAction
          }</p>
          <p><strong>Reason for failure</strong>: ${
            package.delivery.failed.description
          }</p>
          <p>You can track the status of your package and take necessary actions using the following link:</p>
          <p><a href="${client}/track/${
          package.trackID
        }" style="color: #007bff; text-decoration: none;">Track Your Package</a></p>
          <p>If you have any questions or need assistance, please don't hesitate to reach out to our support team.</p>
          <p>Thank you for choosing ParcelPro. We apologize for any inconvenience caused.</p>
          <p>Best regards,</p>
          <p><strong>Team ParcelPro</strong></p>
        `;
        mailSender(mailOptions);
        //---------------------------------------------------------------
        res.status(200).json({
          message: 'Package delivery failed',
          package: package,
          member: member,
          driverReleived: driverReleived,
        });
      }
    } else {
      res.status(403).json({ message: 'You are not assigned to this package' });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

// Route 6: Get a package using: POST "/api/packages/track"
router.post('/track', async (req, res) => {
  try {
    const trackID = req.body.trackID;
    const package = await Package.findOne({ trackID: trackID });
    if (!package) {
      return res.status(404).json({ message: 'Package not found' });
    }
    res.status(200).json({ message: 'Package found', package: package });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;
