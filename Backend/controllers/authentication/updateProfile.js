const bcrypt = require("bcryptjs");
const User = require("../../models/signUpSchema");
const cloudinary = require("../../config/cloudinary");
const fs = require("fs");

const updateProfile = async (req, res) => {
  try {
    // ✔ Correct way (matches your authenticate middleware)
    const userId = req.user.userId;

    const { firstName, lastName, email, password, bio, skills } = req.body;

    // 1️⃣ Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }


    // 2️⃣ Email update (check duplicates)
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).send({ message: "Email already in use." });
      }
      user.email = email;
    }

    // 3️⃣ Update basic fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (bio) user.bio = bio;

    // 4️⃣ Format skills properly
    if (skills) {
      user.skills = Array.isArray(skills)
        ? skills
        : skills.split(",").map((s) => s.trim());
    }

    // 5️⃣ Update password (if provided)
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // 6️⃣ Save user
    const updatedUser = await user.save();

    // 7️⃣ Send safe response
    res.status(200).send({
      message: "Profile updated successfully.",
      user: {
        id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        role: updatedUser.role,
        bio: updatedUser.bio,
        skills: updatedUser.skills,
        profilePicture: updatedUser.profilePicture,
      },
    });

  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).send({
      message: "Error updating profile",
      error: error.message,
    });
  }
};

module.exports = { updateProfile };
