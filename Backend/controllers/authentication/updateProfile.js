const bcrypt = require("bcryptjs");
const User = require("../../models/signUpSchema");
const cloudinary = require("../../config/cloudinary");

const updateProfile = async (req, res) => {
  try {
    const userId = req.user.userId; 
    const { firstName, lastName, email, password, bio, skills } = req.body;

    // 1️⃣ Find user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // 2️⃣ If image uploaded → upload to Cloudinary
    if (req.file) {
      const uploadedImage = await cloudinary.uploader.upload(req.file.path, {
        folder: "profilePictures",
      });

      user.profilePicture = uploadedImage.secure_url; // update field
    }

    // 3️⃣ Update normal fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (bio) user.bio = bio;
    if (skills) user.skills = skills;

    // 4️⃣ Update password
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    // 5️⃣ Save
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
    res
      .status(500)
      .send({ message: "Error updating profile", error: error.message });
  }
};

module.exports = { updateProfile };
