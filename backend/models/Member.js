const mongoose = require('mongoose');
const { Schema } = mongoose;
const { ObjectId } = require('mongodb');

const MemberSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  memberType: {
    type: String,
    required: true,
  },
  engaged: {
    type: Boolean,
    default: false,
  },
  packageId: {
    type: ObjectId,
    ref: 'package',
    default: null,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  lastLogin: {
    type: Date,
    default: Date.now,
  },
});
const Member = mongoose.model('member', MemberSchema);
module.exports = Member;
