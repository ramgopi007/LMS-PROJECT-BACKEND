const mongoose = require('mongoose');
const validator = require('validator');

const signUpSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    min:6,
    max:7
  },
  lastName: {
    type: String,
    required: true,
    min:6,
    max:7
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: 'Please enter a valid email',
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: validator.isStrongPassword,
      message: 'Please enter a valid password',
    },
  },
});

module.exports = mongoose.model('sign', signUpSchema);
