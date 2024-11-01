const { ObjectId } = require('mongodb');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReminderSchema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  title: {
    type: String,
    required: true,
  },
  reminder: {
    type: String,
    required: true,
  },
  dateTimeLocalString: {
    type: String,
    required: true,
  },
  dateTimeUtcUnix: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: 'pending',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('reminder', ReminderSchema);
