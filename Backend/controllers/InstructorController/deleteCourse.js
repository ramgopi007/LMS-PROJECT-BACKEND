const Course = require("../../models/Course");
const Lesson = require("../../models/Lesson");      // Need Lesson model
const User = require("../../models/signUpSchema"); // Need User model
const CourseProgress = require("../../models/progressSchema"); // Assuming you created this model

const deleteCourse = async (req, res) => {
  try {
    const { id } = req.params; // course ID from URL

    // 1️⃣ Find course
    const course = await Course.findOne({
      _id: id,
      instructor: req.user._id, // ensures only the creator can delete
    });

    if (!course) {
      return res.status(404).json({
        success: false,
        message: "Course not found or you are not authorized to delete this course.",
      });
    }

    // 2️⃣ Bulk Cleanup Operations (CRITICAL)
    const deleteOps = [
        // a) Delete all associated Lessons
        Lesson.deleteMany({ course: id }),
        // b) Remove course ID from all enrolled students' arrays
        User.updateMany(
            { enrolledCourses: id },
            { $pull: { enrolledCourses: id } }
        ),
        // c) Remove course ID from the instructor's createdCourses array
        User.findByIdAndUpdate(
            req.user._id,
            { $pull: { createdCourses: id } }
        ),
        // d) Delete all CourseProgress documents related to this course
        CourseProgress.deleteMany({ course: id }),
        // e) Finally, delete the course itself
        Course.findByIdAndDelete(id)
    ];

    // Execute all cleanup operations in parallel
    await Promise.all(deleteOps);
    
    // Note: Cloudinary video deletion for all lessons should ideally happen here too
    // but that requires fetching all Lesson publicIds before deletion.

    // 3️⃣ If deleted successfully
    res.status(200).json({
      success: true,
      message: "Course and all associated data deleted successfully.",
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
 
module.exports = { deleteCourse };