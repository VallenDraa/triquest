const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  username: {
    type: String,
  },
  description: {
    type: String,
    default: '',
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
  scores: [Array],
});

module.exports = mongoose.model('User', userSchema);
