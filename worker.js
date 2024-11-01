// worker.js
// will be used for remind me function
const { Worker, isMainThread, parentPort } = require('worker_threads');
// import mailSender from './assets/mail.main.template';
const mailSender = require('./assets/mail.main.template');
const connectToMongo = require('./db');
require('dotenv').config();
const dayjs = require('dayjs');
// dayjs is a lightweight JavaScript date library for parsing, validating, manipulating, and formatting dates.
const utc = require('dayjs/plugin/utc');
// Importing the 'timezone' plugin to handle time zones
const timezone = require('dayjs/plugin/timezone');

// Adding the plugins to Day.js
dayjs.extend(utc);
dayjs.extend(timezone);
connectToMongo();
// Connect to mongo database

const User = require('./models/User');
const Reminder = require('./models/Reminder');
// User and Reminder models

const handleThisMinuteReminder = async doc => {
  const email = await User.findById(doc.user).select('email -_id');
  mailOptions.to = email.email;
  mailOptions.subject = doc.title;
  mailOptions.text = doc.reminder;
  mailOptions.title = doc.title;
  mailOptions.message = doc.reminder;
  mailOptions.dateTimeLocalString = doc.dateTimeLocalString;
  // update the status only if the email is sent successfully
  if (await mailSender(mailOptions)) {
    await doc.updateOne({ status: 'completed' });
  } else {
    console.log('Error sending email status not updated to completed');
  }
};

let mailOptions = {
  from: `"MyNotebook" <${process.env.EMAIL}>`,
  to: '',
  subject: 'reminder',
  text: '',
  title: '',
  message: '',
  dateTimeLocalString: '',
};

if (isMainThread) {
  // This code is executed in the main thread
  const worker = new Worker(__filename);

  // Listen for messages from the worker thread
  worker.on('message', message => {
    console.log(message);
  });

  // Send a message to the worker thread
  worker.postMessage('start');
} else {
  // This code is executed in the worker thread

  parentPort.on('message', message => {
    console.log('Message from main script:', message);
    parentPort.postMessage('Worker is on!');
  });
  setInterval(async () => {
    // Send a message back to the main thread
    // parentPort.postMessage('Hey from the worker!');
    console.log('Checking Reminders');
    let cursor = Reminder.find({
      status: 'pending',
      dateTimeUtcUnix: { $lte: dayjs().utc().unix() + 60 },
    }).cursor();
    // Filter reminders that are within 1 minute of current time and status pending
    for (
      let doc = await cursor.next();
      doc != null;
      doc = await cursor.next()
    ) {
      handleThisMinuteReminder(doc);
    }
    // Traverse through each reminder and sends it to handleThisMinuteReminder function for further processing
    // Check if there are any reminders
  }, 60000);
  // Checks for reminders every 1 minute
}
