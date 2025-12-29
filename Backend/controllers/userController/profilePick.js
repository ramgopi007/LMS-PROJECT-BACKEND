const User = require("../../models/signUpSchema");

const uploadStudentProfilePicture = async (req, res) => {
  try {
    let imagePath;
    const isRemoval = req.body.removePhoto === "true" || req.body.removePhoto === true;

    if (isRemoval) {
      imagePath = ""; 
    } else {
      if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
      }
      // Save only the relative path for the frontend
      imagePath = `/uploads/${req.file.filename}`;
    }

    const updatedStudent = await User.findByIdAndUpdate(
      req.user.userId,
      { profilePicture: imagePath },
      { new: true }
    ).select("-password");

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profilePicture: imagePath,
      student: updatedStudent, 
    });
  } catch (error) {
    console.error("Upload Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { uploadStudentProfilePicture };