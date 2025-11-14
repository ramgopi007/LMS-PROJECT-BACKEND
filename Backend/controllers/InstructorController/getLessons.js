const Lesson = require("../../models/Lesson");

const getLessons = async (req, res) => {
  try {
    const { courseId } = req.params;

    const lessons = await Lesson.find({ course: courseId }).sort({ createdAt: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      lessons,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching lessons",
      error: error.message,
    });
  }
};

module.exports = { getLessons };
