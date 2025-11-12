const bcrypt = require("bcryptjs");
const User = require("../../models/signUpSchema");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; // from middleware (after verifying JWT)
    const { firstName, lastName, email, password, bio, skills, profilePicture } =
      req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Update fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;
    if (profilePicture) user.profilePicture = profilePicture;

    // Update password if provided
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).send({
      message: "Profile updated successfully.",
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        bio: user.bio,
        skills: user.skills,
        profilePicture: user.profilePicture,
      },
    });
  } catch (error) {
    res.status(500).send({ message: "Error updating profile", error: error.message });
  }
};

module.exports = {updateProfile};
