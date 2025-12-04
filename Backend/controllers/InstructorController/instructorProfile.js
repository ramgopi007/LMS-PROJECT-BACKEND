// controllers/instructorDashboardController.js

const getInstructorProfile = async (req, res) => {
  try {
    const user = req.user; // instructorAuth middleware already sets this

    res.json({
      name: `${user.firstName} ${user.lastName}`,
      email: user.email,
      role: user.role,
      profilePicture: user.profilePicture,
      bio: user.bio,
      skills: user.skills,
      createdCourses: user.createdCourses,
      createdAt: user.createdAt,
    });
  } catch (error) {
    console.error("Profile fetch error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getInstructorProfile };
