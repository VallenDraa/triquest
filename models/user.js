const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  country: {
    type: String,
    required: true,
    default: 'global',
  },
  dateJoin: {
    type: Date,
    required: true,
    default: Date.now(),
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  scores: {},
});

module.exports = mongoose.model('User', userSchema);
