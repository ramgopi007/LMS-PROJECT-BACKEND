const Course = require("../../models/Course");

// 🟥 Delete a course (only course owner can delete)
const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params; // course ID from URL

    // 1️⃣ Delete only if instructor owns this course
    const course = await Course.findOneAndDelete({
      _id: id,
      instructor: req.user._id, // ensures only the creator can delete
    });

    // 2️⃣ If not found (doesn't exist or not instructor's course)
    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you are not authorized to delete this course.",
      });
    }

    // 3️⃣ If deleted successfully
    res.status(200).json({
      success: true,
      message: "Course deleted successfully.",
    });

  } catch (error) {
    console.error("Error deleting course:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error while deleting the course.",
      error: error.message,
    });
  }
};
 
module.exports = {deleteCourse};