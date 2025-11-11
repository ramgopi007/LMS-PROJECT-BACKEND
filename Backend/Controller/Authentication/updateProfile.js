const bcrypt = require('bcrypt');
const signUpSchema = require('../models/signUpSchema');

// Update Profile Controller
const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // from middleware
    const { firstName, lastName, email, password } = req.body;

    // Find user
    const user = await signUpSchema.findById(userId);
    if (!user) {
      return res.status(404).send({ message: 'User not found.' });
    }

    // Update fields if provided
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).send({
      message: 'Profile updated successfully.',
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    res.status(500).send({ message: 'Error updating profile.', error: error.message });
  }
};

module.exports = updateProfile ;


