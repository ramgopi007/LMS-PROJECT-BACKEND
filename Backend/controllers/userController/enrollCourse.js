const mongoose = require("mongoose");
const User = require("../models/signUpSchema");
const Course = require("../models/Course");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

const enrollCourse = async (req, res) => {
  try {
    const userId = req.user.userId;
    const { courseId } = req.params;

    if (!isValidObjectId(courseId))
      return res.status(400).json({ success: false, message: "Invalid course id." });

    const course = await Course.findById(courseId);
    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found." });

    // ensure enrolledCourses exists
    if (!Array.isArray(user.enrolledCourses)) user.enrolledCourses = [];

    // check already enrolled
    const already = user.enrolledCourses.some((c) => c.toString() === courseId);
    if (already) return res.status(400).json({ success: false, message: "Already enrolled." });

    user.enrolledCourses.push(courseId);
    await user.save();

    return res.json({ success: true, message: "Enrolled successfully.", courseId });
  } catch (err) {
    console.error("enrollCourse:", err);
    return res.status(500).json({ success: false, message: "Error enrolling in course." });
  }
};

module.exports = {enrollCourse};
