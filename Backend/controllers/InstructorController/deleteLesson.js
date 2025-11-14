const Lesson = require("../../models/Lesson");

const deleteLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId).populate("course");
    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    // Ensure instructor owns the course
    if (lesson.course.instructor.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await Lesson.findByIdAndDelete(lessonId);

    res.json({
      success: true,
      message: "Lesson deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting lesson",
      error: error.message,
    });
  }
};

module.exports = { deleteLesson };
