const mongoose = require("mongoose");
const Course = require("../../models/Course");
const Review = require("../../models/reviewSchema");

const getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);
   
    if (!isValidObjectId(courseId))
      return res.status(400).json({ success: false, message: "Invalid course id." });

    const course = await Course.findById(courseId)
      .populate("instructor", "firstName lastName profilePicture bio skills")
      .populate({
        path: "lessons", // New: Populate all lessons
        select: "title description order duration", // Select necessary fields
        options: { sort: { order: 1 } } // Sort lessons by the new 'order' field
      })
      .populate("ratingAndReviews"); // New: Populate reviews (assuming a Review model)

    if (!course) return res.status(404).json({ success: false, message: "Course not found." });
    return res.json({ success: true, data: course });

  } catch (err) {
    console.error("getCourseDetails:", err);
    return res.status(500).json({ success: false, message: "Error fetching course details." });
  }
};

module.exports = { getCourseDetails };