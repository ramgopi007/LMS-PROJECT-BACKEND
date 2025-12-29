// controllers/InstructorController/getLessonById.js
const Lesson = require("../../models/Lesson"); 

const getLessonById = async (req, res) => {
  try {
    const { lessonId } = req.params;

    const lesson = await Lesson.findById(lessonId);

    if (!lesson) {
      return res.status(404).json({ message: "Lesson not found" });
    }

    res.status(200).json({
      success: true,
      lesson,
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lesson details", error: error.message });
  }
};

module.exports = { getLessonById };