const mongoose = require("mongoose");
const Course = require("../../models/Course");
const Review = require('../../models/reviewSchema');

const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.userId; 

    if (!mongoose.Types.ObjectId.isValid(courseId))
      return res.status(400).json({ success: false, message: "Invalid course id." });

    const course = await Course.findById(courseId)
      .populate("instructor", "firstName lastName profilePicture bio skills")
      .populate({
        path: "lessons",
        select: "title description order duration videoUrl", 
        options: { sort: { order: 1 } }
      })
      .populate("ratingAndReviews");

    if (!course) return res.status(404).json({ success: false, message: "Course not found." });

    // ✨ BULLETPROOF CHECK: Convert both to strings
    const isEnrolled = course.studentsEnrolled.some(
        (id) => id.toString() === userId?.toString()
    );

    return res.json({ 
        success: true, 
        data: { 
            ...course._doc, 
            isEnrolled: !!isEnrolled // Forces it to be true or false
        } 
    });

  } catch (err) {
    console.error("getCourseDetails Error:", err);
    return res.status(500).json({ success: false, message: "Error fetching course details." });
  }
};

module.exports = { getCourseDetails };