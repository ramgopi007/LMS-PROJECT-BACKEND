const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Lesson title is required"],
  },
  videoUrl: {
    type: String,
    required: [true, "Video URL is required (Cloudinary / S3 etc.)"],
  },
  duration: {
    type: Number, // in seconds
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Course title is required"],
    trim: true,
    minlength: [5, "Title must be at least 5 characters long"]
  },
  description: {
    type: String,
    required: [true, "Course description is required"],
    minlength: [10, "Description must be at least 10 characters long"]
  },
  category: {
    type: String,
    required: [true, "Category is required"],
    enum: ["Web Development", "Java", "Python", "Data Science", "Other"],
  },
  price: {
    type: Number,
    default: 0,
    min: [0, "Price cannot be negative"]
  },
  instructor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  // ⭐ Add lessons array
  lessons: [lessonSchema],

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Course", courseSchema);
