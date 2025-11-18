const mongoose = require("mongoose");
const User = require("../../models/signUpSchema");
const Lesson = require("../../models/Lesson");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const getSingleLesson = async (req, res) => {
  try {
    const { lessonId } = req.params;
    const userId = req.user.userId;

    if (!isValidObjectId(lessonId))
      return res.status(400).json({ success: false, message: "Invalid lesson id." });

    const lesson = await Lesson.findById(lessonId);
    if (!lesson) return res.status(404).json({ success: false, message: "Lesson not found." });

    // check enrollment
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    const courseId = lesson.course && lesson.course.toString();
    const enrolled = Array.isArray(user.enrolledCourses) && user.enrolledCourses.some(c => c.toString() === courseId);
    if (!enrolled) return res.status(403).json({ success: false, message: "You must enroll to access this lesson." });

    return res.json({ success: true, data: lesson });
  } catch (err) {
    console.error("getSingleLesson:", err);
    return res.status(500).json({ success: false, message: "Error fetching lesson." });
  }
};

module.exports = {getSingleLesson};