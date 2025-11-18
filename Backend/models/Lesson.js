const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: [100, "Title cannot exceed 100 characters"],
  },
  description: {
    type: String,
    required: true,
  },
  videoUrl: {
    type: String,
    required: true,
  },
  // *** Added LMS-Specific Fields ***
  duration: {
    type: Number, // Duration in seconds
    required: true,
  },
  order: {
    type: Number, // Lesson order within the course
    required: true,
  },
}, { timestamps: true }); // Adding timestamps is generally good practice

module.exports = mongoose.model("Lesson", lessonSchema);