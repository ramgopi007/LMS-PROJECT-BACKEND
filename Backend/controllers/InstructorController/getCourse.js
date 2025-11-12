const Course = require("../../models/Course");

// 🟦 Get all courses created by the logged-in instructor
const getMyCourses = async (req, res) => {
  try {
    // req.user is attached by the instructorAuth middleware
    const instructorId = req.user._id;

    // Find all courses where instructor matches the logged-in user's ID
    const courses = await Course.find({ instructor: instructorId })
      .sort({ createdAt: -1 }) // optional: newest first
      .populate("instructor", "name email"); // optional: show instructor details

    // If no courses found
    if (!courses || courses.length === 0) {
      return res.status(200).json({
        success: true,
        message: "You have not created any courses yet.",
        courses: [],
      });
    }

    // If courses exist
    res.status(200).json({
      success: true,
      count: courses.length,
      courses,
    });
  } catch (error) {
    console.error("Error fetching instructor courses:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while fetching courses",
      error: error.message,
    });
  }
};

module.exports = {getMyCourses};
