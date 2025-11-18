const Lesson = require("../../models/Lesson");
const Course = require("../../models/Course"); // Need Course model

const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }
    
    // 1️⃣ Find the course to check ownership (or populate it first)
    const course = await Course.findById(lesson.course);

    // Ensure instructor owns the course
    if (!course || course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized: You do not own this lesson's course." });
    }

    // 2️⃣ Delete the lesson from the database
    await Lesson.findByIdAndDelete(lessonId);
    
    // 3️⃣ Remove the lesson ID from the course's lessons array (CRITICAL)
    course.lessons.pull(lessonId);
    await course.save();

    // Note: You should also delete the video from Cloudinary here using the lesson's publicId.

    res.json({
      success: true,
      message: "Lesson deleted successfully and removed from course.",
    });
  } catch (error) {
    // ... (error handling)
    res.status(500).json({
      message: "Error deleting lesson",
      error: error.message,
    });
  }
};

module.exports = { deleteLesson };