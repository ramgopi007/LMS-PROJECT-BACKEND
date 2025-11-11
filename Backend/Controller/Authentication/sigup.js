const signUpSchema = require('../models/SignUpSchema');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const signup = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate email format
    if (!validator.isEmail(email)) {
      return res.status(400).send({ message: 'Please provide a valid email address.' });
    }

    // Validate password strength
    if (!validator.isStrongPassword(password)) {
      return res.status(400).send({ message: 'Password is not strong enough.' });
    }

    // Check if user already exists
    const existingUser = await signUpSchema.findOne({ email });
    if (existingUser) {
      return res.status(400).send({ message: 'Email is already registered.' });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create and save new user
    const newUser = new signUpSchema({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await newUser.save();

    // Respond without password
    res.status(201).send({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email
      }
    });

  } catch (error) {
    res.status(500).send({ message: 'Error creating user', error: error.message });
  }
}

module.exports = {signup};
