const jwt = require('jsonwebtoken');
const signUpSchema = require('../models/SignUpSchema');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Login controller
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Validate inputs
    if (!email || !password) {
      return res.status(400).send({ message: 'Email and password are required.' });
    }

    // 2️⃣ Find user by email
    const user = await signUpSchema.findOne({ email });
    if (!user) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    // 3️⃣ Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send({ message: 'Invalid email or password.' });
    }

    // 4️⃣ Generate JWT
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your_jwt_secret_key',
      { expiresIn: '1h' }
    );

    // 5️⃣ Store token in cookie
    res.cookie('token', token, {
      httpOnly: true,        // Prevent JS access (helps against XSS)
      secure: false
    });

    // 6️⃣ Send success response
    res.status(200).send({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).send({ message: 'Error logging in', error: error.message });
  }
};

module.exports = {login};