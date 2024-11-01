const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Reminder = require('../models/Reminder');

const { body, validationResult } = require('express-validator');

// Route 1: Get all the Reminders /api/reminders/fetchallreminders Login required
router.get('/fetchallreminders', fetchuser, async (req, res) => {
  try {
    const reminders = await Reminder.find({ user: req.user.id });
    res.json(reminders);
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server Error');
  }
});

// Route 2: Add a new Reminder using POST /api/reminders/addreminder Login required
router.post(
  '/addreminder',
  fetchuser,
  [
    body('reminder', 'Enter a valid reminder').isLength({ min: 1 }),
    body('title', 'Enter a valid title').isLength({ min: 1 }),
  ],
  async (req, res) => {
    try {
      // If there are errors, return bad request and the errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { title, reminder, status, dateTimeUtcUnix, dateTimeLocalString } =
        req.body;
      const newReminder = new Reminder({
        title,
        reminder,
        status,
        dateTimeUtcUnix,
        dateTimeLocalString,
        user: req.user.id,
      });
      const saveReminder = await newReminder.save();
      res.json({ saveReminder });
    } catch (error) {
      console.log(error);
      res.status(500).send('Internal server Error');
    }
  }
);
// Route 3: Update an existing todo using: PUT /api/reminders/updatereminder .Login required
router.put('/updatereminder/:id', fetchuser, async (req, res) => {
  const { title, reminder, status, dateTimeUtcUnix, dateTimeLocalString } =
    req.body;
  // Create a new object
  try {
    const newReminder = {};
    if (title) {
      newReminder.title = title;
    }
    if (reminder) {
      newReminder.reminder = reminder;
    }
    if (dateTimeLocalString) {
      newReminder.dateTimeLocalString = dateTimeLocalString;
    }
    if (dateTimeUtcUnix) {
      newReminder.dateTimeUtcUnix = dateTimeUtcUnix;
    }

    // Find the todo to be updated and update it
    let updateReminder = await Reminder.findById(req.params.id);
    if (!updateReminder) {
      return res.status(404).send('Not Found');
    }
    if (updateReminder.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }
    if (updateReminder.status === 'completed') {
      return res.status(401).send('Not Allowed');
    }

    updateReminder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { $set: newReminder },
      { new: true }
    );
    res.json({ updateReminder });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server Error');
  }
});

// Route 4: Complete an existing todo using: PUT /api/reminder/completereminder .Login required
router.put('/completereminder/:id', fetchuser, async (req, res) => {
  const { status } = req.body;
  // Create a new object
  try {
    const newReminder = {};
    if (status) {
      newReminder.status = status;
    }
    // Find the todo to be updated and update it
    let completeReimnder = await Reminder.findById(req.params.id);
    if (!completeReimnder) {
      return res.status(404).send('Not Found');
    }
    if (completeReimnder.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    completeReimnder = await Reminder.findByIdAndUpdate(
      req.params.id,
      { $set: newReminder },
      { new: true }
    );
    res.json({ completeReimnder });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server Error');
  }
});

// Route 5: Delete an existing todo using: DELETE /api/remeinder/deletereminder .Login required
router.delete('/deletereminder/:id', fetchuser, async (req, res) => {
  try {
    // Find the todo to be deleted and delete it
    let deleteReminder = await Reminder.findById(req.params.id);
    if (!deleteReminder) {
      return res.status(404).send('Not Found');
    }
    // Allow deletion only if user owns this Todo
    if (deleteReminder.user.toString() !== req.user.id) {
      return res.status(401).send('Not Allowed');
    }

    deleteReminder = await Reminder.findByIdAndDelete(req.params.id);
    res.json({ Success: 'Reminder has been deleted' });
  } catch (error) {
    console.log(error);
    res.status(500).send('Internal server Error');
  }
});

module.exports = router;
