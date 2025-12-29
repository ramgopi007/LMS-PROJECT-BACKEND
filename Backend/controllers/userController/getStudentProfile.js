const User = require("../../models/signUpSchema");

const getStudentProfile = async (req, res) => {
  try {
    // req.user is populated by userAuth middleware
    const student = await User.findById(req.user.userId).select("-password");

    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        firstName: student.firstName,
        lastName: student.lastName,
        name: `${student.firstName} ${student.lastName}`,
        email: student.email,
        role: student.role,
        profilePicture: student.profilePicture,
        bio: student.bio,
        skills: student.skills,
        enrolledCourses: student.enrolledCourses || [],
        createdAt: student.createdAt,
      },
    });
  } catch (error) {
    console.error("Get Profile Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getStudentProfile };