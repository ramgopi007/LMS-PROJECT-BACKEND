const User = require("../models/signUpSchema");

const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { firstName, lastName, email, bio, skills, profilePicture } = req.body;

    const updates = {};
    if (firstName !== undefined) updates.firstName = firstName;
    if (lastName !== undefined) updates.lastName = lastName;
    if (email !== undefined) updates.email = email.toLowerCase();
    if (bio !== undefined) updates.bio = bio;
    if (profilePicture !== undefined) updates.profilePicture = profilePicture;
    if (skills !== undefined) {
      if (Array.isArray(skills)) updates.skills = skills;
      else if (typeof skills === "string") updates.skills = skills.split(",").map(s => s.trim()).filter(Boolean);
    }

    // If password update is required here, you should hash it before setting updates.password.
    // Example omitted purposely to avoid accidental plaintext storage.

    const user = await User.findByIdAndUpdate(userId, updates, { new: true, runValidators: true }).select("-password");
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    return res.json({ success: true, data: user });
  } catch (err) {
    console.error("updateUserProfile:", err);
    // handle duplicate email error
    if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
      return res.status(409).json({ success: false, message: "Email already in use." });
    }
    return res.status(500).json({ success: false, message: "Error updating profile." });
  }
};

module.exports = {updateUserProfile};