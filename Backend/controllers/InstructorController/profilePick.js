const User = require("../../models/signUpSchema");

const uploadInstructorProfilePicture = async (req, res) => {
  try {
    let imagePath;

    // Check if we are deleting or uploading
    if (req.body.removePhoto === "true" || req.body.removePhoto === true) {
      imagePath = ""; // Reset to empty string in Database
    } else {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      imagePath = `/uploads/${req.file.filename}`;
    }

    const instructor = await User.findByIdAndUpdate(
      req.user.id,
      { profilePicture: imagePath },
      { new: true }
    ).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      profilePicture: imagePath,
      instructor,
    });
  } catch (error) {
    console.error("Profile upload error:", error);
    res.status(500).json({ message: "Operation failed" });
  }
};

module.exports = { uploadInstructorProfilePicture };