const mongoose = require("mongoose");
const Course = require("../models/Course");

const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    if (!isValidObjectId(courseId))
      return res.status(400).json({ success: false, message: "Invalid course id." });

    const course = await Course.findById(courseId)
      .populate("instructor", "firstName lastName profilePicture bio skills");

    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    return res.json({ success: true, data: course });
  } catch (err) {
    console.error("getCourseDetails:", err);
    return res.status(500).json({ success: false, message: "Error fetching course details." });
  }
};

module.exports = {getCourseDetails};
